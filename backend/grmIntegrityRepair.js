#!/usr/bin/env node
/**
 * grmIntegrityRepair.js
 * Node.js GRM integrity check & safe repair tool
 *
 * Usage:
 *   node grmIntegrityRepair.js --uri "mongodb://localhost:27017" --db fao_db --coll grms
 *   node grmIntegrityRepair.js --coll grms --apply --yes
 *
 * Notes:
 *  - Dry-run by default (no changes). Use --apply to perform repairs.
 *  - Use --yes to auto-confirm the apply step.
 *  - Requires `mongodump` available in PATH for backups.
 */

const { MongoClient, ObjectId } = require('mongodb');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEFAULT_URI = 'mongodb://localhost:27017';
const DEFAULT_DB = 'fao_db';
const DEFAULT_BACKUP_BASE = './grm_backups';
const DEFAULT_LOG_DIR = './grm_integrity_logs';

const argv = require('process').argv.slice(2);

// Simple CLI parsing (no external dependency)
function parseArgs(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--uri') { out.uri = args[++i]; continue; }
    if (a === '--db') { out.db = args[++i]; continue; }
    if (a === '--coll') { out.coll = args[++i]; continue; }
    if (a === '--apply') { out.apply = true; continue; }
    if (a === '--yes') { out.yes = true; continue; }
    if (a === '--backup-dir') { out.backup = args[++i]; continue; }
    if (a === '-h' || a === '--help') { out.help = true; continue; }
    // ignore unknown for now
  }
  return out;
}

const args = parseArgs(argv);

if (args.help) {
  console.log('Usage: node grmIntegrityRepair.js --coll <collection> [--uri <uri>] [--db <db>] [--apply] [--yes] [--backup-dir <dir>]');
  process.exit(0);
}

const MONGO_URI = args.uri || DEFAULT_URI;
const DB_NAME = args.db || DEFAULT_DB;
const COLL_NAME = args.coll;
const APPLY = args.apply === true;
const ASSUME_YES = args.yes === true;
const BACKUP_BASE = args.backup || DEFAULT_BACKUP_BASE;
const LOG_DIR = DEFAULT_LOG_DIR;

if (!COLL_NAME) {
  console.error('ERROR: --coll <collection> is required');
  process.exit(2);
}

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_DIR = path.join(BACKUP_BASE, `${DB_NAME}_${TIMESTAMP}`);
const REPORT_FILE = path.join(BACKUP_DIR, `integrity_report_${COLL_NAME}_${TIMESTAMP}.json`);
const LOG_FILE = path.join(LOG_DIR, `integrity_${COLL_NAME}_${TIMESTAMP}.log`);

function log(...parts) {
  const line = `[${new Date().toISOString()}] ${parts.join(' ')}`;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (e) { /* ignore */ }
}
function fatal(msg) {
  log('FATAL:', msg);
  process.exit(1);
}
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

// Ensure directories
ensureDir(BACKUP_DIR);
ensureDir(LOG_DIR);

// Run mongodump (returns Promise)
function runMongodump(uri, db, outDir) {
  return new Promise((resolve, reject) => {
    log('Starting mongodump backup...');
    const args = ['--uri', uri, '--db', db, '--out', outDir];
    const child = spawn('mongodump', args, { stdio: 'inherit' });
    child.on('error', (err) => reject(new Error(`mongodump not found or failed to start: ${err.message}`)));
    child.on('close', (code) => {
      if (code === 0) {
        log('mongodump finished:', outDir);
        resolve();
      } else {
        reject(new Error(`mongodump exited with code ${code}`));
      }
    });
  });
}

// Aggregation pipeline helpers
const PIPELINES = {
  duplicates: [
    { $match: { reportId: { $ne: null } } },
    { $group: { _id: '$reportId', count: { $sum: 1 }, docs: { $push: { _id: '$_id', createdAt: '$createdAt' } } } },
    { $match: { count: { $gt: 1 } } },
    { $limit: 500 }
  ],
  missingFields: [
    { $project: {
      grm_id_exists: { $cond: [{ $ifNull: ['$grm_id', false] }, 1, 0] },
      status_exists: { $cond: [{ $ifNull: ['$status', false] }, 1, 0] },
      createdAt_exists: { $cond: [{ $ifNull: ['$createdAt', false] }, 1, 0] },
      reporter_exists: { $cond: [{ $ifNull: ['$reporter', false] }, 1, 0] },
      location_exists: { $cond: [{ $ifNull: ['$location', false] }, 1, 0] }
    }},
    { $group: { _id: null, total: { $sum: 1 },
      missing_grm_id: { $sum: { $cond: [{ $eq: ['$grm_id_exists', 0] }, 1, 0] } },
      missing_status: { $sum: { $cond: [{ $eq: ['$status_exists', 0] }, 1, 0] } },
      missing_createdAt: { $sum: { $cond: [{ $eq: ['$createdAt_exists', 0] }, 1, 0] } },
      missing_reporter: { $sum: { $cond: [{ $eq: ['$reporter_exists', 0] }, 1, 0] } },
      missing_location: { $sum: { $cond: [{ $eq: ['$location_exists', 0] }, 1, 0] } }
    }}
  ],
  badStatus: [
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $match: { _id: { $nin: ['open', 'in_progress', 'resolved', 'closed'] } } }
  ],
  orphans: [
    { $lookup: { from: 'users', localField: 'reporter', foreignField: '_id', as: 'u' } },
    { $match: { reporter: { $exists: true }, 'u.0': { $exists: false } } },
    { $project: { reporter: 1 } },
    { $limit: 100 }
  ],
  badLocation: [
    { $match: { location: { $type: 'string' } } },
    { $project: { location: 1, parts_count: { $size: { $split: [{ $ifNull: ['$location', ''] }, ','] } } } },
    { $match: { parts_count: { $lt: 2 } } },
    { $limit: 100 }
  ]
};

async function runChecks(db, collName) {
  const coll = db.collection(collName);
  log('Running integrity checks...');
  const results = {};
  results.collectionCount = await coll.countDocuments();
  results.missingFields = await coll.aggregate(PIPELINES.missingFields).toArray();
  results.badStatus = await coll.aggregate(PIPELINES.badStatus).toArray();
  results.duplicates = await coll.aggregate(PIPELINES.duplicates).toArray();
  results.orphans = await coll.aggregate(PIPELINES.orphans).toArray();
  results.badLocation = await coll.aggregate(PIPELINES.badLocation).toArray();
  return results;
}

/**
 * Apply repairs (mutating operations).
 * Each operation is attempted and errors are logged but we continue where safe.
 */
async function applyRepairs(db, collName, archiveCollName) {
  const coll = db.collection(collName);
  const archive = db.collection(archiveCollName);

  // 1) Normalize status values
  log('Normalizing status values...');
  const mapping = {
    'Open': 'open', 'OPEN': 'open', 'open ': 'open', 'Open ': 'open',
    'In Progress': 'in_progress', 'inprogress': 'in_progress', 'in_progress': 'in_progress',
    'Resolved ': 'resolved', 'resolved ': 'resolved', 'Resolved': 'resolved',
    'Closed': 'closed', 'closed ': 'closed'
  };
  for (const [k, v] of Object.entries(mapping)) {
    try {
      const r = await coll.updateMany({ status: k }, { $set: { status: v }, $currentDate: { updatedAt: true } });
      log(`Normalized '${k}' -> '${v}', modified: ${r.modifiedCount}`);
    } catch (e) {
      log('Error normalizing status', k, e.toString());
    }
  }

  // 2) Populate timestamps from ObjectId where missing
  log('Populating missing createdAt/updatedAt from ObjectId timestamps...');
  try {
    const cursor = coll.find({ $or: [{ createdAt: { $exists: false } }, { updatedAt: { $exists: false } }] });
    let populated = 0;
    while (await cursor.hasNext()) {
      const d = await cursor.next();
      const ts = d._id.getTimestamp ? d._id.getTimestamp() : new Date();
      const upd = {};
      if (!d.createdAt) upd.createdAt = ts;
      if (!d.updatedAt) upd.updatedAt = ts;
      await coll.updateOne({ _id: d._id }, { $set: upd });
      populated++;
    }
    log('Timestamps populated for', populated, 'documents');
  } catch (e) {
    log('Error populating timestamps:', e.toString());
  }

  // 3) Deduplicate by reportId (archive duplicates, keep earliest by createdAt or ObjectId)
  log('Deduplicating by reportId (archiving duplicates)...');
  try {
    const dupGroups = await coll.aggregate([
      { $match: { reportId: { $ne: null } } },
      { $group: { _id: '$reportId', count: { $sum: 1 }, docs: { $push: { _id: '$_id', createdAt: '$createdAt' } } } },
      { $match: { count: { $gt: 1 } } }
    ], { allowDiskUse: true }).toArray();

    log('Duplicate groups found:', dupGroups.length);
    for (const g of dupGroups) {
      // sort by createdAt (if present) else ObjectId timestamp
      g.docs.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt) : a._id.getTimestamp();
        const tb = b.createdAt ? new Date(b.createdAt) : b._id.getTimestamp();
        return ta - tb;
      });
      const keeper = g.docs[0]._id;
      const toArchiveIds = g.docs.slice(1).map(d => d._id);
      if (toArchiveIds.length > 0) {
        // fetch those docs
        const docs = await coll.find({ _id: { $in: toArchiveIds } }).toArray();
        // annotate and insert into archive
        const annotated = docs.map(d => ({ ...d, __archived_from: 'dedupe', archivedAt: new Date() }));
        if (annotated.length) {
          await archive.insertMany(annotated);
          await coll.deleteMany({ _id: { $in: toArchiveIds } });
          log(`reportId=${g._id}: archived ${annotated.length}, kept ${keeper}`);
        }
      }
    }
  } catch (e) {
    log('Error during deduplication:', e.toString());
  }

  // 4) Fix orphan reporters: move reporter -> reporter_raw and unset reporter
  log('Fixing orphan reporters (reporter -> reporter_raw)...');
  try {
    // find reporters with no matching user
    const orphans = await coll.aggregate([
      { $lookup: { from: 'users', localField: 'reporter', foreignField: '_id', as: 'u' } },
      { $match: { reporter: { $exists: true }, 'u.0': { $exists: false } } },
      { $project: { _id: 1, reporter: 1 } },
      { $limit: 1000 }
    ]).toArray();

    for (const o of orphans) {
      await coll.updateOne({ _id: o._id }, { $set: { reporter_raw: o.reporter }, $unset: { reporter: '' } });
    }
    log('Orphan reporters patched:', orphans.length);
  } catch (e) {
    log('Error fixing orphan reporters:', e.toString());
  }

  // 5) Parse location string -> location_chiefdom, location_district
  log("Parsing 'location' strings into location_chiefdom/location_district...");
  try {
    const cur = coll.find({ location: { $type: 'string' } }).limit(20000);
    let parsed = 0;
    while (await cur.hasNext()) {
      const d = await cur.next();
      const parts = (d.location || '').split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        await coll.updateOne({ _id: d._id }, { $set: { location_chiefdom: parts[0], location_district: parts[1] } });
        parsed++;
      }
    }
    log('Parsed locations for', parsed, 'documents');
  } catch (e) {
    log('Error parsing location strings:', e.toString());
  }

  // 6) Attempt to create unique index on reportId if no duplicates remain
  try {
    const remaining = await coll.aggregate([
      { $match: { reportId: { $ne: null } } },
      { $group: { _id: '$reportId', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: 'dupcount' }
    ]).toArray();
    const dupcount = (remaining && remaining[0] && remaining[0].dupcount) ? remaining[0].dupcount : 0;
    if (dupcount === 0) {
      try {
        await coll.createIndex({ reportId: 1 }, { unique: true, background: true, name: 'ux_reportId' });
        log('Unique index ux_reportId created.');
      } catch (eidx) {
        log('Creating unique index failed (likely duplicate or insufficient privileges):', eidx.toString());
      }
    } else {
      log('Duplicates still present:', dupcount, '; skipping unique index creation.');
    }
  } catch (e) {
    log('Error re-checking duplicates:', e.toString());
  }

  // 7) ReIndex (best-effort)
  try {
    const reidx = await coll.reIndex();
    log('reIndex result:', JSON.stringify(reidx));
  } catch (e) {
    log('reIndex failed or not supported in this deployment:', e.toString());
  }

  // 8) Attempt compact (best-effort; may need admin privileges and standalone)
  try {
    log('Attempting compact() - this may fail on replica sets or without privileges.');
    const adminDb = db.admin();
    const r = await adminDb.command({ compact: COLL_NAME });
    log('compact result:', JSON.stringify(r));
  } catch (e) {
    log('compact() not performed:', e.toString());
  }

  log('Repairs applied (attempted).');
}

// Main run
(async () => {
  log('GRM Integrity Repair started');
  log('Target:', MONGO_URI, 'DB:', DB_NAME, 'COLL:', COLL_NAME);

  // 1) Backup with mongodump
  try {
    await runMongodump(MONGO_URI, DB_NAME, BACKUP_DIR + '/mongodump');
  } catch (e) {
    fatal('Backup failed: ' + e.toString());
  }

  // 2) Connect to MongoDB
  let client;
  try {
    client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    log('Connected to MongoDB');
  } catch (e) {
    fatal('MongoDB connect failed: ' + e.toString());
  }

  try {
    const db = client.db(DB_NAME);

    // 3) Run checks
    const checks = await runChecks(db, COLL_NAME);
    // 4) Write report
    const report = {
      timestamp: TIMESTAMP,
      db: DB_NAME,
      collection: COLL_NAME,
      collection_count: checks.collectionCount,
      checks: {
        missingFields: checks.missingFields,
        badStatus: checks.badStatus,
        duplicates: checks.duplicates,
        orphans: checks.orphans,
        badLocation: checks.badLocation
      }
    };
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf8');
    log('Integrity report written to', REPORT_FILE);

    if (!APPLY) {
      log('Dry-run complete. No changes were made. To apply repairs, re-run with --apply (and --yes to auto-confirm).');
      await client.close();
      process.exit(0);
    }

    // Confirm apply
    if (!ASSUME_YES) {
      process.stdout.write('\nYou invoked --apply. This WILL make changes to the database.\nType "I AGREE" to proceed: ');
      const stdin = process.stdin;
      stdin.setEncoding('utf8');
      const answer = await new Promise((resolve) => {
        stdin.once('data', d => resolve(d.toString().trim()));
      });
      if (answer !== 'I AGREE') {
        log('Confirmation not provided; exiting without changes.');
        await client.close();
        process.exit(0);
      }
    } else {
      log('--yes provided; auto-confirming.');
    }

    // Ensure archive collection exists
    const archiveCollName = `${COLL_NAME}_archive_${TIMESTAMP}`;
    try {
      await db.createCollection(archiveCollName);
      log('Archive collection created:', archiveCollName);
    } catch (e) {
      log('Archive collection create (may already exist):', e.toString());
    }

    // Apply repairs
    await applyRepairs(db, COLL_NAME, archiveCollName);

    log('All done. Report:', REPORT_FILE, 'Log:', LOG_FILE, 'Backup:', BACKUP_DIR);
    await client.close();
    process.exit(0);

  } catch (e) {
    log('Unexpected error during operations:', e.toString());
    if (client) await client.close();
    process.exit(1);
  }
})();


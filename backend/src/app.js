// backend/src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

// --------------------------------------------------------
// CORS CONFIG
// --------------------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --------------------------------------------------------
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------------------------------------------
// IMPORTANT: No sanitize libraries here.
// Node 22 breaks all packages that mutate req.query.
// --------------------------------------------------------

// --------------------------------------------------------
export default app;


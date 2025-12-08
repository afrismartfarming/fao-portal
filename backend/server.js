import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./src/app.js";
import createContentIndexes from "./src/startup/createContentIndexes.js";
import cors from "cors";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import contentRoutes from "./src/routes/contentRoutes.js";
import grmRoutes from "./src/routes/grmRoutes.js";
import mediaRoutes from "./src/routes/mediaRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js"; 

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("🟢 MongoDB Connected");

    await createContentIndexes();

    // CORS FIX
    app.use(cors({
      origin: [
        "https://fao-portal.onrender.com",
        "https://fao-portal-1.onrender.com"
      ],
      methods: ["GET","POST","PUT","DELETE","PATCH"],
      credentials: true
    }));

    // REGISTER ROUTES
    app.use("/api/auth", authRoutes);
    app.use("/api/content", contentRoutes);
    app.use("/api/grm", grmRoutes);
    app.use("/api/media", mediaRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/analytics", analyticsRoutes);

    app.listen(PORT, () => console.log(`🔥 Server live on port ${PORT}`));

  } catch (err) {
    console.error("🔴 Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();

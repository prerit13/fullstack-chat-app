import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// =======================
// MIDDLEWARES
// =======================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ✅ PRODUCTION SAFE CORS
app.use(
  cors({
    origin: true, // allow same-origin in production
    credentials: true,
  })
);

// =======================
// API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// =======================
// SERVE FRONTEND (IMPORTANT)
// =======================
app.use(express.static(path.join(__dirname, "../Frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});



// =======================
// SERVER
// =======================
server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
  connectDB();
});

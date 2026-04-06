import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import socketHandler from "./sockets/socket.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// ================= LOAD ENV =================
dotenv.config();

// ================= APP INIT =================
const app = express();
const server = http.createServer(app);

// ================= MIDDLEWARE =================
app.use(express.json());

// CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sk-sanjay-chat.vercel.app"
  ],
  credentials: true
}));

// ================= SERVE UPLOADS =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
// Now /uploads/filename.jpg is accessible publicly

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://sk-sanjay-chat.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

socketHandler(io);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
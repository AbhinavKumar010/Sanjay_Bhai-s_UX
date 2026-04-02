const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const socketHandler = require("./sockets/socket");

// Load env
dotenv.config();

const app = express();
const server = http.createServer(app);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",            // Vite dev
    "https://sk-sanjay-chat.vercel.app"  // deployed frontend
  ],
  credentials: true
}));

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));

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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
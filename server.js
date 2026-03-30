const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandler = require("./sockets/socket");

dotenv.config();

const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(express.json());

// DB CONNECT
connectDB();

// ROUTES
app.use("/api/auth", require("./backend/routes/authRoutes"));

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

socketHandler(io);

// START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
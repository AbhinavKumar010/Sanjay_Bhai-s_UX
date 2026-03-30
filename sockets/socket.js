let waitingUsers = [];
let onlineUsers = {}; // socketId -> username or user info

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // REGISTER USER
    socket.on("register", (username) => {
      onlineUsers[socket.id] = { username, socketId: socket.id };
      io.emit("online-users", Object.values(onlineUsers));
    });

    // MATCHING
    socket.on("find-match", () => {
      // try to match with someone in the waiting queue
      if (waitingUsers.length > 0) {
        const partnerSocketId = waitingUsers.pop();

        // notify both users
        io.to(socket.id).emit("match-found", onlineUsers[partnerSocketId]);
        io.to(partnerSocketId).emit("match-found", onlineUsers[socket.id]);
      } else {
        waitingUsers.push(socket.id);
      }
    });

    // SIGNALING FOR WEBRTC
    socket.on("offer", ({ to, offer }) => {
      io.to(to).emit("offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }) => {
      io.to(to).emit("answer", { from: socket.id, answer });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("ice-candidate", { from: socket.id, candidate });
    });

    // TEXT CHAT
    socket.on("send-message", ({ to, message }) => {
      io.to(to).emit("receive-message", message);
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove from waiting users
      waitingUsers = waitingUsers.filter((id) => id !== socket.id);

      // Remove from online users and notify
      delete onlineUsers[socket.id];
      io.emit("online-users", Object.values(onlineUsers));
    });
  });
};

module.exports = socketHandler;
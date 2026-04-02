let waitingUsers = [];
let onlineUsers = {};
let activeRooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ================= REGISTER USER =================
    socket.on("register", (username) => {
      onlineUsers[socket.id] = { username, socketId: socket.id };
      io.emit("online-users", Object.values(onlineUsers));
    });

    // ================= FIND MATCH =================
    socket.on("find-match", () => {
      waitingUsers = waitingUsers.filter((id) => id !== socket.id);

      let partnerSocketId = null;

      while (waitingUsers.length > 0) {
        const id = waitingUsers.pop();
        if (id !== socket.id && onlineUsers[id]) {
          partnerSocketId = id;
          break;
        }
      }

      if (partnerSocketId) {
        const roomId = `room-${socket.id}-${partnerSocketId}`;
        socket.join(roomId);
        io.sockets.sockets.get(partnerSocketId)?.join(roomId);

        activeRooms[socket.id] = roomId;
        activeRooms[partnerSocketId] = roomId;

        io.to(socket.id).emit("match-found", { partner: onlineUsers[partnerSocketId], roomId });
        io.to(partnerSocketId).emit("match-found", { partner: onlineUsers[socket.id], roomId });
      } else {
        waitingUsers.push(socket.id);
      }
    });

    // ================= NEXT USER =================
    socket.on("next", () => {
      const roomId = activeRooms[socket.id];
      if (roomId) {
        socket.leave(roomId);
        delete activeRooms[socket.id];
      }
      waitingUsers.push(socket.id);
    });

    // ================= WEBRTC SIGNALING =================
    socket.on("offer", ({ to, offer }) => io.to(to).emit("offer", { from: socket.id, offer }));
    socket.on("answer", ({ to, answer }) => io.to(to).emit("answer", { from: socket.id, answer }));
    socket.on("ice-candidate", ({ to, candidate }) => io.to(to).emit("ice-candidate", { from: socket.id, candidate }));

    // ================= CHAT =================
    socket.on("send-message", ({ roomId, message }) => {
      if (roomId) socket.to(roomId).emit("receive-message", { from: socket.id, message });
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      waitingUsers = waitingUsers.filter((id) => id !== socket.id);

      const roomId = activeRooms[socket.id];
      if (roomId) socket.to(roomId).emit("partner-disconnected");
      delete activeRooms[socket.id];

      delete onlineUsers[socket.id];
      io.emit("online-users", Object.values(onlineUsers));
    });
  });
};

module.exports = socketHandler;
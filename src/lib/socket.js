const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const redisConnection = require("../config/redis");

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }, // Professional: update this to your frontend URL later
  });

  // Connect Socket.io to Redis for horizontal scaling
  const pubClient = redisConnection;
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Room-based collaboration
    socket.on("join-project", (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project room: ${projectId}`);
    });

    // Broadcast file changes
    socket.on("code-update", (data) => {
      // Sends to everyone in the project room except the sender
      socket.to(data.projectId).emit("receive-update", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
};

module.exports = setupSocket;

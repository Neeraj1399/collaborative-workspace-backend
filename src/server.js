require("dotenv").config();
const http = require("http");
const app = require("./app");
const prisma = require("./config/db");
const setupSocket = require("./lib/socket");
require("./lib/worker");

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// FIX: Capture the returned 'io' instance and attach it to the 'app'
const io = setupSocket(server);
app.set("io", io);

async function start() {
  try {
    // 1. Database Connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // 2. Start the Server
    server.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
      console.log(`📡 Real-time Engine & Workers: Online`);
    });
  } catch (err) {
    console.error("💥 Critical Startup Error:", err);
    process.exit(1);
  }
}

start();

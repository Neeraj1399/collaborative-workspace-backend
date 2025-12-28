const Redis = require("ioredis");

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
};

const connection = new Redis(redisConfig);

connection.on("connect", () => console.log("✅ Redis Connected"));
connection.on("error", (err) => console.error("❌ Redis Error:", err));

module.exports = connection;

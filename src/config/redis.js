const Redis = require("ioredis");

// 1. Check if we have a full URL (Render) or individual pieces (Local)
const redisUrl = process.env.REDIS_URL;

let redisConfig;

if (redisUrl) {
  // Production (Render)
  redisConfig = redisUrl;
} else {
  // Local Development
  redisConfig = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  };
}

const connection = new Redis(redisConfig, {
  maxRetriesPerRequest: null,
  // CRITICAL: This enables the secure connection required by Render
  tls:
    redisUrl && redisUrl.startsWith("rediss://")
      ? { rejectUnauthorized: false }
      : undefined,
});

connection.on("connect", () => console.log("✅ Redis Connected"));
connection.on("error", (err) => {
  // This prevents the app from crashing if Redis isn't ready immediately
  console.error("❌ Redis Error:", err.message);
});

module.exports = connection;

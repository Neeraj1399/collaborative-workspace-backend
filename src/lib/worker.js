const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");

const worker = new Worker(
  "code-execution",
  async (job) => {
    const { projectId, code } = job.data;

    console.log(`[Worker] Starting job ${job.id} for Project ${projectId}`);

    await new Promise((res) => setTimeout(res, 5000));

    console.log(`[Worker] Finished job ${job.id}`);

    return {
      status: "completed",
      output: `Simulated output for: ${code.substring(0, 10)}...`,
      timestamp: new Date(),
    };
  },
  { connection: redisConnection }
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = worker;

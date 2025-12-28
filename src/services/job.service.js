const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

// Ensure the queue name matches your worker: "code-execution"
const codeQueue = new Queue("code-execution", { connection: redisConnection });

class JobService {
  async queueCodeExecution(projectId, code, userId) {
    const job = await codeQueue.add(
      "execute",
      { projectId, code, userId },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      }
    );
    return job.id;
  }

  // Adding the missing method for the controller
  async getJobResult(jobId) {
    const job = await codeQueue.getJob(jobId);
    if (!job) return null;

    const state = await job.getState(); // completed, failed, delayed, active, waiting
    return {
      id: job.id,
      state,
      progress: job.progress,
      result: job.returnvalue, // This is the output from your worker.js
      failedReason: job.failedReason,
    };
  }
}

module.exports = new JobService();

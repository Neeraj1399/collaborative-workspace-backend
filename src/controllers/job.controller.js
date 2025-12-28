const jobService = require("../services/job.service");
const { sendSuccess } = require("../utils/response");
const AppError = require("../utils/appError");

/**
 * Triggered when a user wants to execute code in a project
 * Requirement: Asynchronous Job Processing (Requirement #4)
 */
exports.runCode = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { code, language } = req.body;

    // 1. Validation
    if (!code) {
      return next(new AppError("No code provided for execution", 400));
    }

    // 2. Queue the job via the Service
    // We pass the userId so the worker knows who ran the code
    const jobId = await jobService.queueCodeExecution(
      projectId,
      code,
      req.user.id
    );

    // 3. Return 202 Accepted (Standard for Background Tasks)
    return sendSuccess(
      res,
      {
        jobId,
        status: "queued",
        message: "Your code is being processed in the background.",
      },
      202
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Allows the frontend to poll for the result of a specific job
 */
exports.getJobStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const jobData = await jobService.getJobResult(jobId);

    if (!jobData) {
      return next(new AppError("Job not found", 404));
    }

    return sendSuccess(res, jobData);
  } catch (error) {
    next(error);
  }
};

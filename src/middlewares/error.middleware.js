const { sendError } = require("../utils/response");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // 1. Log for internal observability (Requirement #5)
  console.error(`[${new Date().toISOString()}] 💥 Error:`, {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
  });
  // Add this before your "Production vs Development" logic
  if (err.code === "P2002") {
    err.message = `Duplicate field value: ${err.meta.target}`;
    err.statusCode = 400;
    err.isOperational = true;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Invalid token. Please log in again.";
    err.statusCode = 401;
    err.isOperational = true;
  }
  // 2. Production vs Development response
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production: Send clean, non-sensitive messages
  return sendError(
    res,
    err.isOperational ? err.message : "An unexpected error occurred",
    err.statusCode
  );
};

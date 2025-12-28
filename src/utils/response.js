/**
 * Standard API Response Formatter
 */
exports.sendSuccess = (res, data, statusCode = 200, message = "Success") => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

exports.sendError = (
  res,
  message = "Internal Server Error",
  statusCode = 500
) => {
  return res.status(statusCode).json({
    // Dynamically set 'fail' for 4xx and 'error' for 5xx
    status: `${statusCode}`.startsWith("4") ? "fail" : "error",
    message,
  });
};

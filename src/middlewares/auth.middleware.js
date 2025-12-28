const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Using your AppError keeps responses consistent across the API
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Decoded usually contains { id, email, iat, exp }
    req.user = decoded;

    next();
  } catch (err) {
    // Catching specific JWT errors (like TokenExpiredError) is helpful for the frontend
    const message =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return next(new AppError(message, 401));
  }
};

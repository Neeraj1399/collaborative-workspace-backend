const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Import our custom logic
const projectRoutes = require("./routes/project.routes");
const authRoutes = require("./routes/auth.routes");
const globalErrorHandler = require("./middlewares/error.middleware"); // The one we just made
const AppError = require("./utils/appError");

const app = express();

// 1. Security & Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 2. API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// 3. API Versioning
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);

// 4. Handle Undefined Routes (404)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Global Error Handler (Uses our professional middleware)
app.use(globalErrorHandler);

module.exports = app;

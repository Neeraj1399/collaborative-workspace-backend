const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const projectRoutes = require("./routes/project.routes");
const authRoutes = require("./routes/auth.routes");
const globalErrorHandler = require("./middlewares/error.middleware");
const AppError = require("./utils/appError");

const app = express();

// 1. Security & Logging Middlewares
app.use(helmet());

// Update CORS: Allow your local dev AND your future frontend URL
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 2. API Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// --- NEW: Root Health Check Route ---
// This prevents the "Can't find /" error on your main Render link
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Collaborative Workspace API is live! 🚀",
    timestamp: new Date().toISOString(),
  });
});

// 3. API Versioning
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);

// 4. Handle Undefined Routes (404)
// In Express 5, wildcards must be named (e.g., *path)
app.all("*path", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Global Error Handler
app.use(globalErrorHandler);

module.exports = app;

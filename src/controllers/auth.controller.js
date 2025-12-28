const { sendSuccess } = require("../utils/response");
const AppError = require("../utils/appError");
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const { user, accessToken } = await authService.register(email, password);

    sendSuccess(
      res,
      { user, accessToken },
      201,
      "User registered successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const { user, accessToken } = await authService.login(email, password);

    sendSuccess(res, { user, accessToken }, 200, "User logged in successfully");
  } catch (error) {
    next(error);
  }
};

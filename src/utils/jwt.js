const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

exports.generateToken = (payload, type = "access") => {
  const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
  const expiry = type === "access" ? "15m" : "7d";

  return jwt.sign(payload, secret, { expiresIn: expiry });
};

exports.verifyToken = (token, type = "access") => {
  try {
    const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

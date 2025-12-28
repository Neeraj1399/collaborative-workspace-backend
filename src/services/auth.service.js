const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

class AuthService {
  // 1. Register a new user
  async register(email, password) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true },
    });

    // Consistent return naming: 'accessToken'
    const accessToken = this.generateToken(user, "access");
    const refreshToken = this.generateToken(user, "refresh");

    return { user, accessToken, refreshToken };
  }

  // 2. Login user and generate tokens
  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const accessToken = this.generateToken(user, "access");
    const refreshToken = this.generateToken(user, "refresh");

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken,
    };
  }

  generateToken(user, type) {
    // SECURITY: In production, secrets MUST be in .env.
    // Fallbacks are removed to ensure you don't accidentally deploy insecurely.
    const secret =
      type === "access"
        ? process.env.JWT_SECRET
        : process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error(
        `Critical Error: JWT_${type.toUpperCase()}_SECRET is missing in .env`
      );
    }

    const expiry = type === "access" ? "1h" : "7d";

    return jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: expiry,
    });
  }
}

module.exports = new AuthService();

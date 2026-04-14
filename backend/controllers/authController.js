import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateUniqueConnectCode from "../utils/generateUniqueConnectCode.js";
import jwt from "jsonwebtoken";

class AuthController {
  static async register(req, res) {
    try {
      const { fullName, username, email, password } = req.body;

      if (!fullName || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password length should be at least 6 characters long" });
      }

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists. Please sign in" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        username,
        fullName,
        email,
        password: hashedPassword,
        connectCode: await generateUniqueConnectCode(),
      });

      await user.save();

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          connectCode: user.connectCode,
        },
      });
    } catch (error) {
      console.log("Registration error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          connectCode: user.connectCode,
        },
      });
    } catch (error) {
      console.log("Login Error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async me(req, res) {
    try {
      return res.status(200).json({
        user: {
          id: req.user.id,
          username: req.user.username,
          fullName: req.user.fullName,
          email: req.user.email,
          connectCode: req.user.connectCode,
        },
      });
    } catch (error) {
      console.log("Me Error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async logout(req, res) {
    return res.json({ message: "Logged out successfully!" });
  }
}

export default AuthController;
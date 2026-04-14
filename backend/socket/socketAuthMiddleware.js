import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token found"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return next(new Error("Invalid token"));
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return next(new Error("No user found"));
    }

    socket.userId = user._id.toString();
    socket.user = user;

    next();
  } catch (error) {
    console.error("Socket auth error", error);
    next(new Error("Authentication failed"));
  }
};
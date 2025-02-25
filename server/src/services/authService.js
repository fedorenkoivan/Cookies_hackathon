import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = "76348734687346874363443434343443333333333";

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

export const registerUser = async (user) => {
  try {
    const existingUser = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [user.email],
        (err, result) => {
          err ? reject(err) : resolve(result);
        }
      );
    });

    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const query = `INSERT INTO users (username, email, mobile, password, userType) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      user.username,
      user.email,
      user.mobile,
      hashedPassword,
      user.userType,
    ];
    await new Promise((resolve, reject) => {
      db.run(query, values, (err) => {
        err ? reject(err) : resolve();
      });
    });

    return { success: true, message: "User registered successfully" };
  } catch (err) {
    console.error("Registration error:", err);
    return {
      success: false,
      message: "Registration failed. Please try again later.",
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        err ? reject(err) : resolve(result);
      });
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, message: "Incorrect password" };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated token:", token);
    console.log(user);

    return {
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email, userType: user.userType },
    };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Login failed. Please try again later." };
  }

};

export const getUserFromToken = async (token) => {
  try {
    const trimmedToken = token.trim();
    console.log("Received token:", trimmedToken);

    const decoded = jwt.verify(trimmedToken, JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id, username, email, mobile, userType FROM users WHERE id = ?",
        [decoded.id],
        (err, result) => {
          err ? reject(err) : resolve(result);
        }
      );
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, user };
  } catch (err) {
    console.error("Token verification error:", err);
    return { success: false, message: "Invalid or expired token" };
  }
};

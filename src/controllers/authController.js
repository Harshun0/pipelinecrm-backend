import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2h" });

const formatUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
});

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      user: formatUser(user),
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists with this email" });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      user: formatUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function getMe(req, res) {
  return res.json({ user: formatUser(req.user) });
}

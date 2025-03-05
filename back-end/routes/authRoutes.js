import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(400).json({ error: "Username already taken" });
      }

      const user = new User({ username, password });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (err) {
      console.error("Error logging in user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

export default router;

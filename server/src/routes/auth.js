import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const safeUser = (u) => ({
  id: u._id, name: u.name, email: u.email, role: u.role,
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
});

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hash });
    res.status(201).json({ user: safeUser(user), token: signToken(user) });
  } catch (e) { next(e); }
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ user: safeUser(user), token: signToken(user) });
  } catch (e) { next(e); }
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: safeUser(req.user) });
});

export default router;
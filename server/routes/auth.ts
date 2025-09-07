import { RequestHandler } from "express";
import { db, uuid, User } from "../models";
import { hashPassword, verifyPassword, signToken, verifyToken } from "../utils/auth";

export const signup: RequestHandler = (req, res) => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const existing = db.users.findByEmail(email);
  if (existing) return res.status(409).json({ error: "Email already registered" });
  const user: User = {
    id: uuid(),
    name,
    email,
    passwordHash: hashPassword(password),
    role: "user",
    createdAt: Date.now(),
  };
  db.users.save(user);
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  const user = db.users.findByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const me: RequestHandler = (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = verifyToken(token);
    const user = db.users.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

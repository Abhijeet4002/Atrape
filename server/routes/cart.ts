import { RequestHandler } from "express";
import { db, Cart, CartItem } from "../models";
import { verifyToken } from "../utils/auth";

function authUserId(req: any): string | null {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    return payload.sub;
  } catch {
    return null;
  }
}

export const getCart: RequestHandler = (req, res) => {
  const userId = authUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const cart = db.carts.getForUser(userId);
  res.json(cart);
};

export const addToCart: RequestHandler = (req, res) => {
  const userId = authUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { itemId, quantity } = req.body as { itemId: string; quantity?: number };
  const item = db.items.findById(itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  const cart = db.carts.getForUser(userId);
  const q = Math.max(1, Number(quantity ?? 1));
  const existing = cart.items.find((i) => i.itemId === itemId);
  if (existing) existing.quantity += q; else cart.items.push({ itemId, quantity: q });
  cart.updatedAt = Date.now();
  db.carts.save(cart);
  res.status(200).json(cart);
};

export const updateCartItem: RequestHandler = (req, res) => {
  const userId = authUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { quantity } = req.body as { quantity: number };
  const itemId = req.params.itemId;
  const cart = db.carts.getForUser(userId);
  const entry = cart.items.find((i) => i.itemId === itemId);
  if (!entry) return res.status(404).json({ error: "Item not in cart" });
  entry.quantity = Math.max(0, Number(quantity));
  cart.items = cart.items.filter((i) => i.quantity > 0);
  cart.updatedAt = Date.now();
  db.carts.save(cart);
  res.json(cart);
};

export const removeFromCart: RequestHandler = (req, res) => {
  const userId = authUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const itemId = req.params.itemId;
  const cart = db.carts.getForUser(userId);
  cart.items = cart.items.filter((i) => i.itemId !== itemId);
  cart.updatedAt = Date.now();
  db.carts.save(cart);
  res.json(cart);
};

export const mergeCart: RequestHandler = (req, res) => {
  // Merge a client-side guest cart into server cart after login
  const userId = authUserId(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const { items } = req.body as { items: CartItem[] };
  const serverCart = db.carts.getForUser(userId);
  for (const ci of items || []) {
    const item = db.items.findById(ci.itemId);
    if (!item) continue;
    const existing = serverCart.items.find((i) => i.itemId === ci.itemId);
    if (existing) existing.quantity += Math.max(1, ci.quantity);
    else serverCart.items.push({ itemId: ci.itemId, quantity: Math.max(1, ci.quantity) });
  }
  serverCart.updatedAt = Date.now();
  db.carts.save(serverCart);
  res.json(serverCart);
};

import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { signup, login, me } from "./routes/auth";
import { listItems, getItem, createItem, updateItem, deleteItem } from "./routes/items";
import { getCart, addToCart, updateCartItem, removeFromCart, mergeCart } from "./routes/cart";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo
  app.get("/api/demo", handleDemo);

  // Auth
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", me);

  // Items
  app.get("/api/items", listItems);
  app.get("/api/items/:id", getItem);
  app.post("/api/items", createItem);
  app.put("/api/items/:id", updateItem);
  app.delete("/api/items/:id", deleteItem);

  // Cart
  app.get("/api/cart", getCart);
  app.post("/api/cart", addToCart);
  app.patch("/api/cart/:itemId", updateCartItem);
  app.delete("/api/cart/:itemId", removeFromCart);
  app.post("/api/cart/merge", mergeCart);

  return app;
}

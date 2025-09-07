import { RequestHandler } from "express";
import { db, Item, uuid } from "../models";
import { verifyToken } from "../utils/auth";

function isAdmin(req: any) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return false;
  try {
    const payload = verifyToken(token);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const listItems: RequestHandler = (req, res) => {
  const { q, category, minPrice, maxPrice, sort } = req.query as Record<string, string>;
  let items = db.items.all();
  if (q) {
    const s = q.toLowerCase();
    items = items.filter((i) => i.title.toLowerCase().includes(s) || i.description.toLowerCase().includes(s));
  }
  if (category) {
    const cats = category.split(",").map((c) => c.trim().toLowerCase());
    items = items.filter((i) => cats.includes(i.category.toLowerCase()));
  }
  if (minPrice) items = items.filter((i) => i.price >= Number(minPrice));
  if (maxPrice) items = items.filter((i) => i.price <= Number(maxPrice));
  if (sort === "price_asc") items.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") items.sort((a, b) => b.price - a.price);
  res.json({ items });
};

export const getItem: RequestHandler = (req, res) => {
  const item = db.items.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
};

export const createItem: RequestHandler = (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const { title, description, price, category, image } = req.body as Partial<Item>;
  if (!title || !description || price == null || !category || !image) return res.status(400).json({ error: "Missing fields" });
  const item: Item = {
    id: uuid(),
    title,
    description,
    price: Number(price),
    category,
    image,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  db.items.save(item);
  res.status(201).json(item);
};

export const updateItem: RequestHandler = (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const item = db.items.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  const { title, description, price, category, image } = req.body as Partial<Item>;
  const updated: Item = {
    ...item,
    title: title ?? item.title,
    description: description ?? item.description,
    price: price != null ? Number(price) : item.price,
    category: category ?? item.category,
    image: image ?? item.image,
    updatedAt: Date.now(),
  };
  db.items.save(updated);
  res.json(updated);
};

export const deleteItem: RequestHandler = (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ error: "Forbidden" });
  const item = db.items.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  db.items.delete(item.id);
  res.status(204).end();
};

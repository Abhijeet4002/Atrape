import fs from "fs";
import path from "path";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // scrypt hash with salt
  role: "user" | "admin";
  createdAt: number;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  price: number; // cents
  category: string;
  image: string;
  createdAt: number;
  updatedAt: number;
};

export type CartItem = { itemId: string; quantity: number };
export type Cart = { userId: string; items: CartItem[]; updatedAt: number };

const dataDir = path.join(process.cwd(), "server", "data");
const usersFile = path.join(dataDir, "users.json");
const itemsFile = path.join(dataDir, "items.json");
const cartsFile = path.join(dataDir, "carts.json");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function readJson<T>(file: string, fallback: T): T {
  ensureDir();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  const raw = fs.readFileSync(file, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(file: string, data: T) {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export const db = {
  users: {
    all(): User[] {
      return readJson<User[]>(usersFile, []);
    },
    findByEmail(email: string) {
      return this.all().find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    findById(id: string) {
      return this.all().find((u) => u.id === id);
    },
    save(user: User) {
      const users = this.all();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx >= 0) users[idx] = user; else users.push(user);
      writeJson(usersFile, users);
      return user;
    },
  },
  items: {
    all(): Item[] {
      return readJson<Item[]>(itemsFile, []);
    },
    save(item: Item) {
      const items = this.all();
      const idx = items.findIndex((i) => i.id === item.id);
      if (idx >= 0) items[idx] = item; else items.push(item);
      writeJson(itemsFile, items);
      return item;
    },
    delete(id: string) {
      const items = this.all().filter((i) => i.id !== id);
      writeJson(itemsFile, items);
    },
    findById(id: string) {
      return this.all().find((i) => i.id === id);
    },
  },
  carts: {
    all(): Cart[] {
      return readJson<Cart[]>(cartsFile, []);
    },
    getForUser(userId: string): Cart {
      const carts = this.all();
      let cart = carts.find((c) => c.userId === userId);
      if (!cart) {
        cart = { userId, items: [], updatedAt: Date.now() };
        writeJson(cartsFile, [...carts, cart]);
      }
      return cart;
    },
    save(cart: Cart) {
      const carts = this.all();
      const idx = carts.findIndex((c) => c.userId === cart.userId);
      if (idx >= 0) carts[idx] = cart; else carts.push(cart);
      writeJson(cartsFile, carts);
      return cart;
    },
    clear(userId: string) {
      const carts = this.all().filter((c) => c.userId !== userId);
      writeJson(cartsFile, carts);
    },
  },
};

export function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

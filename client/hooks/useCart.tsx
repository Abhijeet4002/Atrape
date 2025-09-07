import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./useAuth";

export type CartItem = { itemId: string; quantity: number };
export type Cart = { userId?: string; items: CartItem[] };

const GUEST_KEY = "guest_cart";

function loadGuestCart(): Cart {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as Cart;
    return { items: parsed.items || [] };
  } catch {
    return { items: [] };
  }
}

function saveGuestCart(cart: Cart) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(cart));
}

const CartContext = createContext<{
  items: CartItem[];
  add: (itemId: string, quantity?: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  update: (itemId: string, quantity: number) => Promise<void>;
  clearGuest: () => void;
} | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  async function fetchServerCart() {
    const cart = await api<{ userId: string; items: CartItem[] }>("/api/cart");
    setItems(cart.items);
  }

  // Load initial cart depending on auth state
  useEffect(() => {
    if (user) {
      // Merge guest cart into server then fetch
      const guest = loadGuestCart();
      if (guest.items.length) {
        api("/api/cart/merge", { method: "POST", body: JSON.stringify({ items: guest.items }) }).finally(() => {
          saveGuestCart({ items: [] });
          fetchServerCart();
        });
      } else {
        fetchServerCart();
      }
    } else {
      const guest = loadGuestCart();
      setItems(guest.items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const value = useMemo(() => ({
    items,
    async add(itemId: string, quantity = 1) {
      if (user) {
        await api("/api/cart", { method: "POST", body: JSON.stringify({ itemId, quantity }) });
        await fetchServerCart();
      } else {
        const guest = loadGuestCart();
        const existing = guest.items.find((i) => i.itemId === itemId);
        if (existing) existing.quantity += quantity; else guest.items.push({ itemId, quantity });
        saveGuestCart(guest);
        setItems([...guest.items]);
      }
    },
    async remove(itemId: string) {
      if (user) {
        await api(`/api/cart/${itemId}`, { method: "DELETE" });
        await fetchServerCart();
      } else {
        const guest = loadGuestCart();
        guest.items = guest.items.filter((i) => i.itemId !== itemId);
        saveGuestCart(guest);
        setItems([...guest.items]);
      }
    },
    async update(itemId: string, quantity: number) {
      if (user) {
        await api(`/api/cart/${itemId}`, { method: "PATCH", body: JSON.stringify({ quantity }) });
        await fetchServerCart();
      } else {
        const guest = loadGuestCart();
        const entry = guest.items.find((i) => i.itemId === itemId);
        if (entry) entry.quantity = Math.max(0, quantity);
        guest.items = guest.items.filter((i) => i.quantity > 0);
        saveGuestCart(guest);
        setItems([...guest.items]);
      }
    },
    clearGuest() {
      saveGuestCart({ items: [] });
      setItems([]);
    },
  }), [items, user]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

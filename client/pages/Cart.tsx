import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";

type Item = { id: string; title: string; price: number; image: string };

const fallback = "/placeholder.svg";

export default function Cart() {
  const { items, remove, update } = useCart();
  const [catalog, setCatalog] = useState<Record<string, Item>>({});

  useEffect(() => {
    fetch("/api/items").then((r) => r.json()).then((d) => {
      const map: Record<string, Item> = {};
      (d.items as Item[]).forEach((i) => (map[i.id] = i));
      setCatalog(map);
    });
  }, []);

  const detailed = items.map((ci) => ({ ...ci, item: catalog[ci.itemId] })).filter((x) => x.item);
  const subtotal = useMemo(() => detailed.reduce((s, i) => s + i.item.price * i.quantity, 0), [detailed]);

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {detailed.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {detailed.map((ci) => (
              <div key={ci.itemId} className="flex items-center gap-4 rounded-xl border p-4">
                <img loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }} src={ci.item.image} alt={ci.item.title} className="h-20 w-20 rounded object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium">{ci.item.title}</h3>
                  <p className="text-sm text-muted-foreground">${(ci.item.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => update(ci.itemId, ci.quantity - 1)} className="h-8 w-8 rounded-md border">-</button>
                  <input value={ci.quantity} onChange={(e) => update(ci.itemId, Number(e.target.value))} className="w-12 text-center rounded-md border h-8" />
                  <button onClick={() => update(ci.itemId, ci.quantity + 1)} className="h-8 w-8 rounded-md border">+</button>
                </div>
                <button onClick={() => remove(ci.itemId)} className="rounded-md border px-3 py-2 text-sm hover:bg-accent">Remove</button>
              </div>
            ))}
          </div>
          <div className="rounded-xl border p-6 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${(subtotal / 100).toFixed(2)}</span>
            </div>
            <button className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium hover:opacity-90">Checkout</button>
            <p className="text-xs text-muted-foreground">Sign in at checkout to save your order history.</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { DemoResponse } from "@shared/api";
import { Link } from "react-router-dom";
import ProductCard, { Product } from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const { user, loading } = useAuth();
  useEffect(() => {
    fetch("/api/items").then((r) => r.json()).then((d) => setFeatured(d.items.slice(0, 4)));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />
        <div className="container py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">New season • Curated tech</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Shop smarter with NovaMart</h1>
              <p className="text-lg text-muted-foreground max-w-prose">Discover premium gadgets and accessories at honest prices. Secure checkout, fast delivery, and a cart that follows you—sign in or out, your picks stay.</p>
              <div className="flex items-center gap-3">
                <Link to="/products" className="rounded-md bg-primary text-primary-foreground px-5 py-3 font-medium hover:opacity-90">Browse products</Link>
                {!loading && !user && (
                  <Link to="/signup" className="rounded-md border px-5 py-3 font-medium hover:bg-accent">Create account</Link>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary to-purple-500 shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 hidden sm:block rounded-xl border bg-background/80 backdrop-blur p-4 shadow-md">
                <p className="text-sm">Cart items persist after logout</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-12 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured</h2>
          <Link to="/products" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

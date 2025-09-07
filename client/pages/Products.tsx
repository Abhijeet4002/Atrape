import { useEffect, useMemo, useState } from "react";
import ProductCard, { Product } from "@/components/ProductCard";
import Filters, { FiltersValue } from "@/components/Filters";

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FiltersValue>({});

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.q) p.set("q", filters.q);
    if (filters.category?.length) p.set("category", filters.category.join(","));
    if (filters.minPrice != null) p.set("minPrice", String(Math.round(filters.minPrice * 100)));
    if (filters.maxPrice != null) p.set("maxPrice", String(Math.round(filters.maxPrice * 100)));
    if (filters.sort) p.set("sort", filters.sort);
    return p.toString();
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/items${params ? `?${params}` : ""}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .finally(() => setLoading(false));
  }, [params]);

  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold">Explore Products</h1>
      <Filters categories={categories} value={filters} onChange={setFilters} />
      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

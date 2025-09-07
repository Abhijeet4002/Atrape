import { useEffect, useState } from "react";

export type FiltersValue = { q?: string; category?: string[]; minPrice?: number; maxPrice?: number; sort?: "price_asc" | "price_desc" };

export default function Filters({ categories, value, onChange }: { categories: string[]; value: FiltersValue; onChange: (v: FiltersValue) => void }) {
  const [local, setLocal] = useState<FiltersValue>(value);

  useEffect(() => setLocal(value), [value.q, value.category?.join(","), value.minPrice, value.maxPrice, value.sort]);

  function apply() { onChange(local); }
  function reset() { const v: FiltersValue = {}; setLocal(v); onChange(v); }

  return (
    <div className="rounded-xl border p-4 bg-card">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-sm font-medium">Search</label>
          <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder="Find products…" value={local.q || ""} onChange={(e) => setLocal({ ...local, q: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={(local.category && local.category[0]) || ""} onChange={(e) => setLocal({ ...local, category: e.target.value ? [e.target.value] : undefined })}>
            <option value="">All</option>
            {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Min $</label>
            <input type="number" min={0} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={local.minPrice ?? ""} onChange={(e) => setLocal({ ...local, minPrice: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div>
            <label className="text-sm font-medium">Max $</label>
            <input type="number" min={0} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={local.maxPrice ?? ""} onChange={(e) => setLocal({ ...local, maxPrice: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Sort</label>
          <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={local.sort || ""} onChange={(e) => setLocal({ ...local, sort: (e.target.value || undefined) as any })}>
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={apply} className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">Apply</button>
        <button onClick={reset} className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">Reset</button>
      </div>
    </div>
  );
}

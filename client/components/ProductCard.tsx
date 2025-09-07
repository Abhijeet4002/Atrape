import { useCart } from "@/hooks/useCart";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

const fallback = "/placeholder.svg";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const price = (product.price / 100).toFixed(2);
  return (
    <div className="group rounded-xl border bg-card hover:shadow-md transition overflow-hidden">
      <div className="aspect-square overflow-hidden bg-muted">
        <img loading="lazy" src={product.image} onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }} alt={product.title} className="h-full w-full object-cover transition group-hover:scale-105" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight line-clamp-2">{product.title}</h3>
          <span className="font-bold">${price}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs rounded bg-secondary px-2 py-1 text-secondary-foreground">{product.category}</span>
          <button onClick={() => add(product.id, 1)} className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">Add to cart</button>
        </div>
      </div>
    </div>
  );
}

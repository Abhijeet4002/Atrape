import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const count = items.reduce((a, b) => a + b.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/60" />
          <span className="font-extrabold tracking-tight text-xl">NovaMart</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/products" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}>Products</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}>Cart ({count})</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-28 rounded-md bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-muted-foreground">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={() => { logout(); navigate("/"); }} className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary">Login</Link>
              <Link to="/signup" className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

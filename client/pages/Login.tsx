import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const { clearGuest } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      clearGuest();
      navigate("/products");
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" required className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" required className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-primary text-primary-foreground px-3 py-2 font-medium hover:opacity-90 disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
        <p className="text-sm text-muted-foreground">Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></p>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
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
      await signup(name, email, password);
      navigate("/products");
    } catch (e: any) {
      setError(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-10 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input required className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" required className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" required className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full rounded-md bg-primary text-primary-foreground px-3 py-2 font-medium hover:opacity-90 disabled:opacity-60">{loading ? "Creating…" : "Create account"}</button>
        <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link></p>
      </form>
    </div>
  );
}

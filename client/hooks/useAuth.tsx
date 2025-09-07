import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken, getAuthToken } from "@/lib/api";

type User = { id: string; name: string; email: string; role: string } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api<User>("/api/auth/me").then(setUser).catch(() => setAuthToken(null)).finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    async login(email, password) {
      const res = await api<{ token: string; user: NonNullable<User> }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(res.token);
      setUser(res.user);
    },
    async signup(name, email, password) {
      const res = await api<{ token: string; user: NonNullable<User> }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setAuthToken(res.token);
      setUser(res.user);
    },
    logout() {
      setAuthToken(null);
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

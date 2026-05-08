import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { z } from "zod";
import { api, useApi, setToken, getToken } from "@/lib/api";

export type Role = "user" | "admin";
export type User = { id: string; name: string; email: string; role: Role };
type StoredUser = User & { password: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const USERS_KEY = "buybuddy_users";
const SESSION_KEY = "buybuddy_session";

const emailSchema = z.string().trim().email("Invalid email").max(255);
const passSchema = z.string().min(6, "Password must be at least 6 chars").max(100);
const nameSchema = z.string().trim().min(2, "Name too short").max(60);

const seed = () => {
  const existing = localStorage.getItem(USERS_KEY);
  if (existing) return;
  const users: StoredUser[] = [
    { id: "u-admin", name: "Admin",     email: "admin@buybuddy.local", password: "Admin@12345", role: "admin" },
    { id: "u-demo",  name: "Demo User", email: "demo@buybuddy.local",  password: "Demo@12345",  role: "user" },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (useApi) {
        const t = getToken();
        if (t) {
          try {
            const { data } = await api.get("/auth/me");
            setUser(data.user);
          } catch { setToken(null); }
        }
      } else {
        seed();
        const s = localStorage.getItem(SESSION_KEY);
        if (s) setUser(JSON.parse(s));
      }
      setLoading(false);
    })();
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    emailSchema.parse(email); passSchema.parse(password);
    if (useApi) {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      return;
    }
    const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const { password: _p, ...safe } = found;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    setUser(safe);
  };

  const register: AuthCtx["register"] = async (name, email, password) => {
    nameSchema.parse(name); emailSchema.parse(email); passSchema.parse(password);
    if (useApi) {
      const { data } = await api.post("/auth/register", { name, email, password });
      setToken(data.token);
      setUser(data.user);
      return;
    }
    const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error("Email already registered");
    const newUser: StoredUser = { id: crypto.randomUUID(), name, email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _p, ...safe } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    setUser(safe);
  };

  const logout = () => {
    if (useApi) setToken(null);
    else localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};

import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      const next = params.get("next") || (loc.state as any)?.from || "/";
      nav(next);
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || err.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-md px-4 py-12 animate-fade-in">
      <div className="relative bg-card rounded-2xl shadow-pop border border-border p-7 overflow-hidden">
        <div className="blob bg-accent w-40 h-40 -top-16 -right-16 animate-blob opacity-40" />
        <div className="blob bg-buy w-40 h-40 -bottom-16 -left-16 animate-blob opacity-30" style={{ animationDelay: "-5s" }} />
        <div className="relative">
        <h1 className="text-3xl font-bold mb-1 gradient-text">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-5">Sign in to continue shopping on BuyBuddy</p>
        <form onSubmit={submit} className="space-y-3">
          <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div><Label htmlFor="p">Password</Label><Input id="p" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <Button type="submit" disabled={loading} size="lg" className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold hover-lift">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="text-sm text-center mt-5">
          New here? <Link to="/register" className="text-accent font-semibold hover:underline">Create account</Link>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

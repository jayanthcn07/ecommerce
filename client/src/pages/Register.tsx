import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Register = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!"); nav("/");
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="container max-w-md px-4 py-12">
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-muted-foreground mb-5">Join BuyBuddy in seconds</p>
        <form onSubmit={submit} className="space-y-3">
          <div><Label>Full name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><Label>Password</Label><Input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent-hover text-accent-foreground">
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-center mt-5">
          Already have an account? <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

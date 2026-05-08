import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User as UserIcon, Search, Package, LogOut, Shield, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/data/products";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useShop();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-header text-header-foreground">
      <div className="container flex items-center gap-3 py-2.5 px-4">
        <Link to="/" className="font-bold text-xl whitespace-nowrap inline-flex items-center gap-1.5 group">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-buy text-accent-foreground font-black shadow-pop transition-transform group-hover:rotate-6 group-hover:scale-110">B</span>
          <span><span className="text-accent">Buy</span>Buddy</span>
        </Link>
        <form onSubmit={onSearch} className="flex-1 max-w-2xl flex">
          <Input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, brands & categories..."
            className="rounded-r-none bg-background text-foreground border-0 h-10 focus-visible:ring-2 focus-visible:ring-accent"
          />
          <Button type="submit" className="rounded-l-none h-10 bg-accent hover:bg-accent-hover text-accent-foreground">
            <Search size={18} />
          </Button>
        </form>
        <nav className="hidden md:flex items-center gap-1">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-header-foreground hover:bg-header-sub hover:text-header-foreground gap-1.5">
                  <UserIcon size={18} />
                  <span className="hidden lg:inline text-sm">Hi, {user.name.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav("/orders")}><Package size={14} className="mr-2" />Orders</DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/wishlist")}><Heart size={14} className="mr-2" />Wishlist</DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onClick={() => nav("/admin")}><Shield size={14} className="mr-2" />Admin Dashboard</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}><LogOut size={14} className="mr-2" />Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="text-header-foreground hover:bg-header-sub hover:text-header-foreground">
              <Link to="/login"><UserIcon size={18} className="mr-1.5" />Sign in</Link>
            </Button>
          )}
          <Button asChild variant="ghost" className="text-header-foreground hover:bg-header-sub hover:text-header-foreground relative">
            <Link to="/wishlist" aria-label="Wishlist">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 grid place-items-center">{wishlist.length}</span>
              )}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-header-foreground hover:bg-header-sub hover:text-header-foreground gap-1.5 relative">
            <Link to="/cart">
              <ShoppingCart size={20} />
              <span className="hidden lg:inline text-sm">Cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 grid place-items-center">{cartCount}</span>
              )}
            </Link>
          </Button>
        </nav>
        <Button asChild variant="ghost" className="md:hidden text-header-foreground hover:bg-header-sub hover:text-header-foreground relative">
          <Link to="/cart"><ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 grid place-items-center">{cartCount}</span>
            )}
          </Link>
        </Button>
      </div>
      <div className="bg-header-sub">
        <div className="container px-4">
          <ul className="flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-hide text-sm">
            <li><NavLink to="/products" className={({isActive}) => `px-3 py-1 rounded hover:bg-white/10 inline-block whitespace-nowrap ${isActive ? "bg-white/10" : ""}`}>All</NavLink></li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <NavLink to={`/products?category=${encodeURIComponent(c)}`}
                         className="px-3 py-1 rounded hover:bg-white/10 inline-block whitespace-nowrap">
                  {c}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

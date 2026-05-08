import { Link } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/data/products";
import hero from "@/assets/hero-banner.jpg";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const Home = () => {
  const { products } = useShop();
  const featured = products.slice(0, 4);
  const deals = [...products].sort((a, b) => (b.mrp ? b.mrp - b.price : 0) - (a.mrp ? a.mrp - a.price : 0)).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero text-header-foreground">
        {/* Animated background blobs */}
        <div className="blob bg-accent w-[420px] h-[420px] -top-32 -left-24 animate-blob" />
        <div className="blob bg-buy w-[360px] h-[360px] top-10 right-0 animate-blob" style={{ animationDelay: "-4s" }} />
        <div className="blob bg-primary-foreground/30 w-[300px] h-[300px] bottom-0 left-1/3 animate-blob" style={{ animationDelay: "-8s" }} />

        <div className="container relative px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-ring" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              Mega Sale Live
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Everything you need.<br />
              <span className="gradient-text">Delivered fast.</span>
            </h1>
            <p className="text-white/80 max-w-md">Shop millions of products across electronics, fashion, home & more — with free shipping on orders over ₹499.</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-accent hover:bg-accent-hover text-accent-foreground font-semibold">
                <Link to="/products">Shop now <ArrowRight className="ml-2" size={18} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link to="/products?category=Electronics">Browse Electronics</Link>
              </Button>
            </div>
          </div>
          <img src={hero} alt="BuyBuddy featured products" width={1600} height={640}
               className="rounded-xl shadow-pop object-cover h-64 md:h-80 w-full animate-float" />
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="container px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { i: Truck, t: "Free shipping", s: "Over ₹499" },
            { i: ShieldCheck, t: "Secure checkout", s: "256-bit SSL" },
            { i: RotateCcw, t: "30-day returns", s: "No questions" },
            { i: Headphones, t: "24/7 support", s: "We're here" },
          ].map(({ i: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <Icon className="text-accent shrink-0" size={22} />
              <div><p className="font-semibold">{t}</p><p className="text-muted-foreground text-xs">{s}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="container px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Shop by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 stagger">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`}
                  className="bg-card rounded-lg p-4 text-center shadow-card border border-border hover-lift">
              <p className="text-sm font-medium">{c}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container px-4 py-8">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-bold">Today's top deals</h2>
          <Link to="/products" className="text-sm text-accent hover:underline">See all</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {deals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="container px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Featured for you</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
};

export default Home;

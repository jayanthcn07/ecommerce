import { useNavigate, useParams, Link } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/shop/Stars";
import { formatPrice } from "@/lib/format";
import { Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, addReview } = useShop();
  const { user } = useAuth();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!product) return <div className="container py-16 text-center">Product not found. <Link to="/products" className="text-accent underline">Back to shop</Link></div>;

  const wished = wishlist.includes(product.id);
  const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { nav("/login"); return; }
    if (!title.trim() || !body.trim()) { toast.error("Please fill all fields"); return; }
    try {
      await addReview(product.id, { user: user.name, rating, title: title.trim().slice(0, 100), body: body.trim().slice(0, 1000) });
      setTitle(""); setBody(""); setRating(5);
      toast.success("Review posted");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e.message || "Could not post review");
    }
  };

  const buyNow = () => {
    addToCart(product.id, qty);
    nav("/checkout");
  };

  return (
    <div className="container px-4 py-6">
      <div className="grid md:grid-cols-2 gap-8 bg-card rounded-lg p-4 md:p-6 shadow-card border border-border">
        <div className="bg-surface rounded-lg overflow-hidden aspect-square">
          <img src={product.image} alt={product.name} width={800} height={800} className="w-full h-full object-contain p-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{product.brand} • {product.category}</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Stars value={product.rating} size={16} />
            <span className="text-sm text-accent">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
          </div>
          <div className="border-t my-4" />
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-price">{formatPrice(product.price)}</span>
            {product.mrp && (
              <>
                <span className="text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
                <span className="bg-success/10 text-success px-2 py-0.5 rounded font-semibold text-sm">-{discount}%</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

          <p className="mt-4 text-sm leading-relaxed">{product.description}</p>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-accent">✓</span>{f}</li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-2 mt-5 text-xs">
            <div className="flex flex-col items-center text-center gap-1 p-2 bg-surface rounded"><Truck size={18} className="text-accent" />Free delivery</div>
            <div className="flex flex-col items-center text-center gap-1 p-2 bg-surface rounded"><RotateCcw size={18} className="text-accent" />30-day return</div>
            <div className="flex flex-col items-center text-center gap-1 p-2 bg-surface rounded"><ShieldCheck size={18} className="text-accent" />1-year warranty</div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <label className="text-sm font-medium">Qty:</label>
            <div className="flex items-center border rounded">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 hover:bg-muted">−</button>
              <span className="px-4 py-1.5 border-x">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-1.5 hover:bg-muted">+</button>
            </div>
            <span className={`text-sm font-medium ${product.stock > 0 ? "text-success" : "text-destructive"}`}>
              {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button size="lg" className="bg-accent hover:bg-accent-hover text-accent-foreground" disabled={product.stock === 0}
                    onClick={() => { addToCart(product.id, qty); toast.success("Added to cart"); }}>
              <ShoppingCart size={18} className="mr-2" />Add to cart
            </Button>
            <Button size="lg" className="bg-buy hover:bg-buy-hover text-buy-foreground" disabled={product.stock === 0} onClick={buyNow}>
              <Zap size={18} className="mr-2" />Buy now
            </Button>
            <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)}>
              <Heart size={18} className={`mr-2 ${wished ? "fill-destructive text-destructive" : ""}`} />
              {wished ? "Saved" : "Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-8 bg-card rounded-lg p-4 md:p-6 shadow-card border border-border">
        <h2 className="text-xl font-bold mb-4">Customer reviews</h2>
        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          <div>
            <p className="text-4xl font-bold">{product.rating}<span className="text-base text-muted-foreground"> / 5</span></p>
            <Stars value={product.rating} size={18} />
            <p className="text-sm text-muted-foreground mt-1">{product.reviewCount.toLocaleString()} ratings</p>

            <form onSubmit={submitReview} className="mt-6 space-y-3">
              <h3 className="font-semibold text-sm">Write a review</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Stars value={n <= rating ? n : 0} size={20} />
                  </button>
                ))}
              </div>
              <div>
                <Label htmlFor="rt" className="text-xs">Title</Label>
                <Input id="rt" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
              </div>
              <div>
                <Label htmlFor="rb" className="text-xs">Review</Label>
                <Textarea id="rb" value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} rows={3} />
              </div>
              <Button type="submit" size="sm" className="bg-accent hover:bg-accent-hover text-accent-foreground">Post review</Button>
            </form>
          </div>
          <div className="space-y-4">
            {product.reviews.length === 0 && <p className="text-muted-foreground text-sm">No reviews yet. Be the first!</p>}
            {product.reviews.map((rv) => (
              <div key={rv.id} className="border-b pb-4">
                <div className="flex items-center gap-2"><Stars value={rv.rating} /><span className="font-semibold text-sm">{rv.title}</span></div>
                <p className="text-xs text-muted-foreground mt-0.5">{rv.user} • {rv.date}</p>
                <p className="text-sm mt-1.5">{rv.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

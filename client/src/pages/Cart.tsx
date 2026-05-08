import { Link, useNavigate } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { cart, products, setQuantity, removeFromCart, cartTotal } = useShop();
  const { user } = useAuth();
  const nav = useNavigate();
  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! })).filter((i) => i.product);
  const shipping = cartTotal > 499 || cartTotal === 0 ? 0 : 49;
  const tax = cartTotal * 0.18;
  const total = cartTotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container px-4 py-16 text-center">
        <ShoppingBag size={56} className="mx-auto text-muted-foreground/50 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
        <Button asChild className="bg-accent hover:bg-accent-hover text-accent-foreground">
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
      <section className="bg-card rounded-lg shadow-card border border-border">
        <h1 className="text-xl font-bold p-4 border-b">Shopping Cart ({items.length})</h1>
        <ul className="divide-y">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="p-4 flex gap-4">
              <Link to={`/product/${product.id}`} className="shrink-0">
                <img src={product.image} alt={product.name} width={120} height={120} loading="lazy"
                     className="w-24 h-24 object-contain bg-surface rounded" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="font-medium hover:text-accent line-clamp-2">{product.name}</Link>
                <p className="text-xs text-muted-foreground mt-0.5">{product.brand}</p>
                <p className="text-sm font-bold text-price mt-1">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded">
                    <button onClick={() => setQuantity(product.id, quantity - 1)} className="px-2 py-1 hover:bg-muted">−</button>
                    <span className="px-3 py-1 border-x text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(product.id, Math.min(product.stock, quantity + 1))} className="px-2 py-1 hover:bg-muted">+</button>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="text-sm text-destructive hover:underline inline-flex items-center gap-1">
                    <Trash2 size={14} />Remove
                  </button>
                </div>
              </div>
              <p className="font-bold text-right whitespace-nowrap">{formatPrice(product.price * quantity)}</p>
            </li>
          ))}
        </ul>
      </section>
      <aside className="bg-card rounded-lg shadow-card border border-border p-5 h-fit lg:sticky lg:top-32 space-y-3">
        <h2 className="font-bold text-lg">Order Summary</h2>
        {(() => {
          const threshold = 499;
          const remaining = Math.max(0, threshold - cartTotal);
          const pct = Math.min(100, (cartTotal / threshold) * 100);
          return (
            <div className="bg-surface rounded-md p-3 -mx-1">
              {remaining > 0 ? (
                <p className="text-xs">Add <span className="font-bold text-accent">{formatPrice(remaining)}</span> more for <span className="font-semibold">FREE shipping</span></p>
              ) : (
                <p className="text-xs text-success font-semibold">🎉 You've unlocked FREE shipping!</p>
              )}
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-buy transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })()}
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? <span className="text-success font-semibold">FREE</span> : formatPrice(shipping)}</span></div>
          <div className="flex justify-between text-sm"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>Total</span><span className="text-price">{formatPrice(total)}</span>
        </div>
        <Button className="w-full bg-buy hover:bg-buy-hover text-buy-foreground font-semibold" size="lg"
                onClick={() => nav(user ? "/checkout" : "/login?next=/checkout")}>
          Proceed to checkout
        </Button>
        <p className="text-xs text-muted-foreground text-center">Secure 256-bit SSL encryption</p>
      </aside>
    </div>
  );
};

export default Cart;

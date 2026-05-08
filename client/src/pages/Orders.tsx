import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams, Link } from "react-router-dom";
import { formatPrice } from "@/lib/format";
import { CheckCircle2, Package } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-buy/20 text-buy-foreground",
  shipped: "bg-accent/20 text-accent",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const Orders = () => {
  const { orders } = useShop();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const placed = params.get("placed");
  // When backed by the API, /orders/mine already returns only the user's orders.
  const my = orders.filter((o) => !o.userId || o.userId === user?.id);

  return (
    <div className="container px-4 py-6 max-w-4xl">
      {placed && (
        <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="text-success" />
          <div><p className="font-semibold">Order placed!</p><p className="text-sm text-muted-foreground">Confirmation: {placed}</p></div>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Your orders</h1>
      {my.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Package size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <Link to="/products" className="text-accent hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {my.map((o) => (
            <article key={o.id} className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
              <header className="bg-surface p-4 flex flex-wrap items-center justify-between gap-2 text-sm border-b">
                <div><p className="text-xs text-muted-foreground">Order</p><p className="font-mono font-semibold">{o.id}</p></div>
                <div><p className="text-xs text-muted-foreground">Placed</p><p>{new Date(o.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-price">{formatPrice(o.total)}</p></div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[o.status]}`}>{o.status}</span>
              </header>
              <ul className="divide-y">
                {o.items.map((i) => (
                  <li key={i.productId} className="p-4 flex gap-3 items-center">
                    <img src={i.image} alt="" className="w-16 h-16 object-contain bg-surface rounded" />
                    <div className="flex-1 min-w-0"><p className="line-clamp-1">{i.name}</p><p className="text-sm text-muted-foreground">Qty {i.quantity}</p></div>
                    <p className="font-medium">{formatPrice(i.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <footer className="px-4 py-3 text-xs text-muted-foreground border-t bg-surface/40">
                Ship to: {o.shipping.fullName}, {o.shipping.address}, {o.shipping.city} {o.shipping.zip}
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

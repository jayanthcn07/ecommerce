import { useShop } from "@/context/ShopContext";
import { formatPrice } from "@/lib/format";
import { IndianRupee, Package, ShoppingBag, Users } from "lucide-react";

const Card = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-card border border-border rounded-lg shadow-card p-4 flex items-center gap-4">
    <div className={`h-10 w-10 rounded-full grid place-items-center ${color}`}><Icon size={20} /></div>
    <div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-bold">{value}</p></div>
  </div>
);

const AdminOverview = () => {
  const { products, orders } = useShop();
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const customers = new Set(orders.map((o) => o.userId)).size;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card icon={IndianRupee} label="Revenue" value={formatPrice(revenue)} color="bg-success/15 text-success" />
        <Card icon={ShoppingBag} label="Orders" value={orders.length} color="bg-accent/15 text-accent" />
        <Card icon={Package} label="Products" value={products.length} color="bg-buy/20 text-buy-foreground" />
        <Card icon={Users} label="Customers" value={customers} color="bg-primary/10 text-primary" />
      </div>
      <div className="bg-card border border-border rounded-lg shadow-card p-4">
        <h2 className="font-bold mb-3">Recent orders</h2>
        {orders.length === 0 ? <p className="text-sm text-muted-foreground">No orders yet.</p> : (
          <ul className="divide-y text-sm">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="py-2 flex justify-between gap-2">
                <span className="font-mono">{o.id}</span>
                <span className="text-muted-foreground">{o.userName}</span>
                <span className="capitalize">{o.status}</span>
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
export default AdminOverview;

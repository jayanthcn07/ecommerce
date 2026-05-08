import { useShop } from "@/context/ShopContext";
import { OrderStatus } from "@/context/ShopContext";
import { formatPrice } from "@/lib/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statuses: OrderStatus[] = ["pending", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useShop();
  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    toast({ title: "Order removed", description: id });
  };
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Orders ({orders.length})</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground bg-card p-6 rounded-lg border border-border">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <article key={o.id} className="bg-card border border-border rounded-lg shadow-card p-4">
              <header className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <p className="font-mono font-semibold">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.userName} • {new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-price">{formatPrice(o.total)}</span>
                  <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as OrderStatus)}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Remove order" title="Remove order">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove order <span className="font-mono">{o.id}</span> from the dashboard. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(o.id)}>Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </header>
              <div className="text-sm text-muted-foreground">
                {o.items.length} item(s) • Ship to {o.shipping.fullName}, {o.shipping.city}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};
export default AdminOrders;
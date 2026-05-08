import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { PaymentGatewayDialog } from "@/components/shop/PaymentGatewayDialog";

const schema = z.object({
  fullName: z.string().trim().min(2).max(80),
  address: z.string().trim().min(5).max(200),
  city: z.string().trim().min(2).max(60),
  zip: z.string().trim().min(3).max(12),
  country: z.string().trim().min(2).max(60),
  phone: z.string().trim().min(7).max(20),
});

const Checkout = () => {
  const { cart, products, cartTotal, placeOrder } = useShop();
  const { user } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: user?.name || "", address: "", city: "", zip: "", country: "India", phone: "" });
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [method, setMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [pendingForceFail, setPendingForceFail] = useState(false);

  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.productId)! })).filter((i) => i.product);
  const shipping = cartTotal > 499 ? 0 : 49;
  const tax = cartTotal * 0.18;
  const total = cartTotal + shipping + tax;

  if (!user) { nav("/login"); return null; }
  if (items.length === 0) { nav("/cart"); return null; }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      schema.parse(form);
      if (method === "card") {
        const num = card.number.replace(/\s/g, "");
        if (num.length < 13 || num.length > 19) throw new Error("Invalid card number");
        if (!/^\d{3,4}$/.test(card.cvv)) throw new Error("Invalid CVV");
        // Demo rule: cards ending in 0000 fail at the gateway.
        setPendingForceFail(num.endsWith("0000"));
      } else {
        setPendingForceFail(false);
      }
      if (method === "cod") {
        // No gateway for cash on delivery — place immediately.
        finalizeOrder({ method: "cod" });
        return;
      }
      setSubmitting(true);
      setGatewayOpen(true);
    } catch (err: any) {
      toast.error(err?.errors?.[0]?.message || err.message || "Please check your details");
    }
  };

  const finalizeOrder = async (payment: { method: string; last4?: string; transactionId?: string }) => {
    try {
      const order = await placeOrder(
        { shipping: form, payment },
        { id: user!.id, name: user!.name }
      );
      toast.success("Order placed successfully!");
      nav(`/orders?placed=${order.id}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e.message || "Could not place order");
    }
  };

  return (
    <div className="container px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
      <form onSubmit={submit} className="space-y-6">
        <section className="bg-card rounded-lg shadow-card border border-border p-5">
          <h2 className="font-bold text-lg mb-4">Shipping address</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { k: "fullName", l: "Full name" }, { k: "phone", l: "Phone" },
              { k: "address", l: "Address", full: true }, { k: "city", l: "City" },
              { k: "zip", l: "ZIP / Postal" }, { k: "country", l: "Country" },
            ].map(({ k, l, full }) => (
              <div key={k} className={full ? "sm:col-span-2" : ""}>
                <Label htmlFor={k}>{l}</Label>
                <Input id={k} required value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-lg shadow-card border border-border p-5">
          <h2 className="font-bold text-lg mb-4">Payment method</h2>
          <RadioGroup value={method} onValueChange={setMethod} className="space-y-2">
            <Label className="flex items-center gap-2 border rounded p-3 cursor-pointer hover:bg-muted has-[:checked]:border-accent">
              <RadioGroupItem value="card" />Credit / Debit card
            </Label>
            <Label className="flex items-center gap-2 border rounded p-3 cursor-pointer hover:bg-muted has-[:checked]:border-accent">
              <RadioGroupItem value="upi" />UPI / Wallet
            </Label>
            <Label className="flex items-center gap-2 border rounded p-3 cursor-pointer hover:bg-muted has-[:checked]:border-accent">
              <RadioGroupItem value="cod" />Cash on delivery
            </Label>
          </RadioGroup>
          {method === "card" && (
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="sm:col-span-2"><Label>Card number</Label><Input maxLength={19} placeholder="4242 4242 4242 4242"
                value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Name on card</Label><Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></div>
              <div><Label>Expiry</Label><Input placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} /></div>
              <div><Label>CVV</Label><Input maxLength={4} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></div>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-3 inline-flex items-center gap-1.5">🔒 Your payment is encrypted end-to-end with BuyBuddy SecurePay.</p>
        </section>
      </form>

      <aside className="bg-card rounded-lg shadow-card border border-border p-5 h-fit lg:sticky lg:top-32 space-y-3">
        <h2 className="font-bold text-lg">Order summary</h2>
        <ul className="divide-y text-sm">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="py-2 flex gap-2 items-center">
              <img src={product.image} alt="" className="w-12 h-12 object-contain bg-surface rounded" />
              <div className="flex-1 min-w-0"><p className="line-clamp-1">{product.name}</p><p className="text-xs text-muted-foreground">Qty {quantity}</p></div>
              <span className="font-medium">{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span className="text-price">{formatPrice(total)}</span></div>
        </div>
        <Button onClick={submit} disabled={submitting} size="lg" className="w-full bg-buy hover:bg-buy-hover text-buy-foreground font-semibold">
          {submitting ? "Placing order..." : `Place order — ${formatPrice(total)}`}
        </Button>
      </aside>

      <PaymentGatewayDialog
        open={gatewayOpen}
        amount={total}
        method={method}
        cardLast4={method === "card" ? card.number.replace(/\s/g, "").slice(-4) : undefined}
        forceFail={pendingForceFail}
        onClose={() => { setGatewayOpen(false); setSubmitting(false); }}
        onComplete={(res) => {
          setGatewayOpen(false);
          setSubmitting(false);
          if (!res.success) {
            toast.error("Payment was declined. Please try again.");
            return;
          }
          finalizeOrder({
            method,
            last4: method === "card" ? card.number.replace(/\s/g, "").slice(-4) : undefined,
            transactionId: res.transactionId,
          });
        }}
      />
    </div>
  );
};

export default Checkout;

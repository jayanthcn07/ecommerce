import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Product, CATEGORIES } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";

const blank = { name: "", description: "", price: 0, mrp: 0, image: "", category: "Electronics", stock: 0, brand: "", features: [] as string[] };

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof blank>(blank);
  const [featuresText, setFeaturesText] = useState("");

  const startNew = () => { setEditing(null); setForm(blank); setFeaturesText(""); setOpen(true); };
  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, mrp: p.mrp || 0, image: p.image, category: p.category, stock: p.stock, brand: p.brand, features: p.features });
    setFeaturesText(p.features.join("\n"));
    setOpen(true);
  };

  const onImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 3 * 1024 * 1024) { toast.error("Image too large (max 3MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((s) => ({ ...s, image: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const save = async () => {
    if (!form.name || !form.image || form.price <= 0) { toast.error("Name, image, and price are required"); return; }
    const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, features, mrp: form.mrp > 0 ? form.mrp : undefined };
    try {
      if (editing) { await updateProduct(editing.id, payload); toast.success("Product updated"); }
      else { await addProduct(payload); toast.success("Product added"); }
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e.message || "Save failed");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={startNew} className="bg-accent hover:bg-accent-hover text-accent-foreground"><Plus size={16} className="mr-1.5" />Add product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Brand</Label><Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Price (₹)</Label><Input type="number" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
              <div><Label>MRP (₹, optional)</Label><Input type="number" step="1" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: +e.target.value })} /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: +e.target.value })} /></div>
              <div className="sm:col-span-2">
                <Label>Image (Cloudinary-ready upload)</Label>
                <div className="flex items-center gap-3">
                  {form.image && <img src={form.image} alt="" className="w-16 h-16 object-contain bg-surface rounded border" />}
                  <label className="flex items-center gap-2 px-3 py-2 border rounded cursor-pointer hover:bg-muted text-sm">
                    <Upload size={14} />Upload<input type="file" accept="image/*" className="hidden" onChange={onImage} />
                  </label>
                  <Input placeholder="...or paste URL" value={form.image.startsWith("data:") ? "" : form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
              </div>
              <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Features (one per line)</Label><Textarea rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} className="bg-accent hover:bg-accent-hover text-accent-foreground">{editing ? "Save" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b">
              <tr><th className="text-left p-3">Product</th><th className="text-left p-3">Category</th><th className="text-right p-3">Price</th><th className="text-right p-3">Stock</th><th className="p-3"></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-surface/50">
                  <td className="p-3 flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 object-contain bg-surface rounded" />
                    <div><p className="font-medium line-clamp-1">{p.name}</p><p className="text-xs text-muted-foreground">{p.brand}</p></div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3 text-right font-semibold">{formatPrice(p.price)}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive"
                            onClick={async () => { if (confirm(`Delete ${p.name}?`)) { try { await deleteProduct(p.id); toast.success("Deleted"); } catch (e: any) { toast.error(e?.response?.data?.message || "Delete failed"); } } }}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default AdminProducts;

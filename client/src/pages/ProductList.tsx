import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

const ProductList = () => {
  const [params, setParams] = useSearchParams();
  const { products } = useShop();
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const [sort, setSort] = useState("relevance");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [search, setSearch] = useState(q);

  const filtered = useMemo(() => {
    let list = [...products];
    if (q) list = list.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand.toLowerCase().includes(q.toLowerCase()) ||
      p.category.toLowerCase().includes(q.toLowerCase())
    );
    if (category) list = list.filter((p) => p.category === category);
    list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [products, q, category, maxPrice, sort]);

  const setCategory = (c: string) => {
    const next = new URLSearchParams(params);
    if (c) next.set("category", c); else next.delete("category");
    setParams(next);
  };

  return (
    <div className="container px-4 py-6 grid lg:grid-cols-[260px_1fr] gap-6">
      <aside className="lg:sticky lg:top-32 lg:self-start space-y-5 bg-card border border-border rounded-lg p-4 shadow-card h-fit">
        <div>
          <Label className="text-xs uppercase text-muted-foreground tracking-wide">Search</Label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)}
                 onKeyDown={(e) => { if (e.key === "Enter") { const n = new URLSearchParams(params); search ? n.set("q", search) : n.delete("q"); setParams(n); } }}
                 placeholder="Search..." className="mt-1.5" />
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm">Category</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={!category} onCheckedChange={() => setCategory("")} />All categories
            </label>
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={category === c} onCheckedChange={() => setCategory(category === c ? "" : c)} />
                {c}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm">Max price: ₹{maxPrice.toLocaleString("en-IN")}</h3>
          <Slider value={[maxPrice]} max={200000} step={1000} onValueChange={(v) => setMaxPrice(v[0])} />
        </div>
      </aside>
      <section>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h1 className="text-xl font-bold">
            {category || "All products"} <span className="text-muted-foreground font-normal text-sm">({filtered.length} results)</span>
          </h1>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">No products match your filters.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList;

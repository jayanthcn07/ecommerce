import { useShop } from "@/context/ShopContext";
import { ProductCard } from "@/components/shop/ProductCard";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, products } = useShop();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="container px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg border border-border">
          <Heart size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
          <Link to="/products" className="text-accent hover:underline">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

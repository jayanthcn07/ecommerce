import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { Stars } from "./Stars";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const wished = wishlist.includes(product.id);
  const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;

  return (
    <article className="group relative flex flex-col rounded-lg bg-card shadow-card overflow-hidden border border-border hover-lift">
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded animate-scale-in">
          -{discount}%
        </span>
      )}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
        className="absolute top-2 right-2 z-10 h-9 w-9 rounded-full bg-card/90 backdrop-blur grid place-items-center hover:bg-card hover:scale-110 active:scale-95 transition-transform shadow-card"
        aria-label="Toggle wishlist"
      >
        <Heart className={`${wished ? "fill-destructive text-destructive animate-scale-in" : "text-muted-foreground"} transition-colors`} size={18} />
      </button>
      <Link to={`/product/${product.id}`} className="block aspect-square bg-surface overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img src={product.image} alt={product.name} loading="lazy" width={800} height={800}
             className="h-full w-full object-contain p-4 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 ease-out" />
      </Link>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="font-medium text-sm line-clamp-2 hover:text-accent">{product.name}</Link>
        <div className="flex items-center gap-1.5 text-xs">
          <Stars value={product.rating} />
          <span className="text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-price">{formatPrice(product.price)}</span>
          {product.mrp && (
            <>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
              <span className="text-xs font-semibold text-success">-{discount}%</span>
            </>
          )}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-destructive font-medium">Only {product.stock} left!</p>
        )}
        <Button size="sm" className="mt-2 bg-accent hover:bg-accent-hover text-accent-foreground"
                onClick={(e) => { e.preventDefault(); addToCart(product.id); toast.success("Added to cart"); }}
                disabled={product.stock === 0}>
          <ShoppingCart size={14} className="mr-1.5" />
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
};

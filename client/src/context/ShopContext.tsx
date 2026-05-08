import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from "react";
import { Product, SEED_PRODUCTS, Review } from "@/data/products";
import { api, useApi, normalize } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export type CartItem = { productId: string; quantity: number };
export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";
export type Order = {
  id: string;
  userId: string;
  userName: string;
  items: { productId: string; name: string; price: number; quantity: number; image: string }[];
  total: number;
  status: OrderStatus;
  shipping: { fullName: string; address: string; city: string; zip: string; country: string; phone: string };
  payment: { method: string; last4?: string; transactionId?: string };
  createdAt: string;
};

type ShopCtx = {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  placeOrder: (data: { shipping: Order["shipping"]; payment: Order["payment"] }, user: { id: string; name: string }) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  addProduct: (p: Omit<Product, "id" | "rating" | "reviewCount" | "reviews">) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addReview: (productId: string, review: Omit<Review, "id" | "date">) => Promise<void>;
  refreshProducts: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
};

const Ctx = createContext<ShopCtx | null>(null);

const useStored = <T,>(key: string, initial: T) => {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(v)); }, [key, v]);
  return [v, setV] as const;
};

const normalizeProduct = (p: any): Product => {
  const n = normalize(p);
  return {
    id: n.id,
    name: n.name,
    description: n.description || "",
    price: n.price,
    mrp: n.mrp,
    image: n.image || "/placeholder.svg",
    category: n.category,
    stock: n.stock ?? 0,
    rating: n.rating ?? 0,
    reviewCount: n.reviewCount ?? 0,
    reviews: (n.reviews || []).map((r: any) => ({
      id: r._id || r.id || crypto.randomUUID(),
      user: r.user,
      rating: r.rating,
      title: r.title || "",
      body: r.body || "",
      date: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : (r.date || ""),
    })),
    brand: n.brand || "",
    features: n.features || [],
  };
};

const normalizeOrder = (o: any): Order => {
  const n = normalize(o);
  return {
    id: n.id,
    userId: typeof n.user === "string" ? n.user : (n.user?._id || ""),
    userName: n.userName,
    items: (n.items || []).map((i: any) => ({
      productId: i.productId?.toString() || "",
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image || "",
    })),
    total: n.total,
    status: n.status,
    shipping: n.shipping,
    payment: n.payment || { method: "card" },
    createdAt: n.createdAt || new Date().toISOString(),
  };
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useStored<Product[]>("shop_products_v4", SEED_PRODUCTS);
  const [cart, setCart] = useStored<CartItem[]>("shop_cart", []);
  const [wishlist, setWishlist] = useStored<string[]>("shop_wishlist", []);
  const [orders, setOrders] = useStored<Order[]>("shop_orders", []);

  const refreshProducts = useCallback(async () => {
    if (!useApi) return;
    try {
      const { data } = await api.get("/products");
      setProducts(data.map(normalizeProduct));
    } catch (e) { console.error("Failed to load products", e); }
  }, [setProducts]);

  const refreshOrders = useCallback(async () => {
    if (!useApi || !user) return;
    try {
      const url = user.role === "admin" ? "/orders" : "/orders/mine";
      const { data } = await api.get(url);
      setOrders(data.map(normalizeOrder));
    } catch (e) { console.error("Failed to load orders", e); }
  }, [user, setOrders]);

  const refreshWishlist = useCallback(async () => {
    if (!useApi || !user) return;
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data.map((p: any) => p._id || p.id));
    } catch (e) { console.error("Failed to load wishlist", e); }
  }, [user, setWishlist]);

  useEffect(() => { refreshProducts(); }, [refreshProducts]);
  useEffect(() => { refreshOrders(); refreshWishlist(); }, [refreshOrders, refreshWishlist]);

  const addToCart = (id: string, qty = 1) => {
    setCart((c) => {
      const ex = c.find((i) => i.productId === id);
      if (ex) return c.map((i) => i.productId === id ? { ...i, quantity: i.quantity + qty } : i);
      return [...c, { productId: id, quantity: qty }];
    });
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.productId !== id));
  const setQuantity = (id: string, q: number) => setCart((c) =>
    q <= 0 ? c.filter((i) => i.productId !== id) : c.map((i) => i.productId === id ? { ...i, quantity: q } : i)
  );
  const clearCart = () => setCart([]);

  const toggleWishlist = async (id: string) => {
    if (useApi && user) {
      try {
        const { data } = await api.post(`/wishlist/${id}`);
        setWishlist(data.wishlist.map((w: any) => w.toString()));
        return;
      } catch (e) { console.error(e); }
    }
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
  };

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartTotal = useMemo(() =>
    cart.reduce((s, i) => {
      const p = products.find((p) => p.id === i.productId);
      return s + (p ? p.price * i.quantity : 0);
    }, 0), [cart, products]);

  const placeOrder: ShopCtx["placeOrder"] = async (data, u) => {
    if (useApi) {
      const { data: created } = await api.post("/orders", {
        items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        shipping: data.shipping,
        payment: data.payment,
      });
      const order = normalizeOrder(created);
      setOrders((o) => [order, ...o]);
      await refreshProducts();
      setCart([]);
      return order;
    }
    const items = cart.map((c) => {
      const p = products.find((p) => p.id === c.productId)!;
      return { productId: p.id, name: p.name, price: p.price, quantity: c.quantity, image: p.image };
    });
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const order: Order = {
      id: "ORD-" + Date.now().toString(36).toUpperCase(),
      userId: u.id, userName: u.name,
      items, total, status: "pending",
      shipping: data.shipping, payment: data.payment,
      createdAt: new Date().toISOString(),
    };
    setOrders((o) => [order, ...o]);
    setProducts((pr) => pr.map((p) => {
      const it = items.find((i) => i.productId === p.id);
      return it ? { ...p, stock: Math.max(0, p.stock - it.quantity) } : p;
    }));
    setCart([]);
    return order;
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    if (useApi) {
      await api.patch(`/orders/${id}/status`, { status });
    }
    setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x));
  };

  const deleteOrder = async (id: string) => {
    if (useApi) {
      try { await api.delete(`/orders/${id}`); } catch (e) { console.error(e); }
    }
    setOrders((o) => o.filter((x) => x.id !== id));
  };

  const addProduct: ShopCtx["addProduct"] = async (p) => {
    if (useApi) {
      const { data } = await api.post("/products", p);
      setProducts((arr) => [normalizeProduct(data), ...arr]);
      return;
    }
    setProducts((arr) => [{ ...p, id: "p-" + crypto.randomUUID().slice(0, 6), rating: 0, reviewCount: 0, reviews: [] }, ...arr]);
  };
  const updateProduct: ShopCtx["updateProduct"] = async (id, p) => {
    if (useApi) {
      const { data } = await api.put(`/products/${id}`, p);
      setProducts((arr) => arr.map((x) => x.id === id ? normalizeProduct(data) : x));
      return;
    }
    setProducts((arr) => arr.map((x) => x.id === id ? { ...x, ...p } : x));
  };
  const deleteProduct = async (id: string) => {
    if (useApi) await api.delete(`/products/${id}`);
    setProducts((arr) => arr.filter((x) => x.id !== id));
  };

  const addReview: ShopCtx["addReview"] = async (productId, review) => {
    if (useApi) {
      const { data } = await api.post(`/products/${productId}/reviews`, {
        rating: review.rating, title: review.title, body: review.body,
      });
      setProducts((arr) => arr.map((p) => p.id === productId ? normalizeProduct(data) : p));
      return;
    }
    setProducts((arr) => arr.map((p) => {
      if (p.id !== productId) return p;
      const newReview = { ...review, id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10) };
      const reviews = [newReview, ...p.reviews];
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
      return { ...p, reviews, rating: Math.round(avg * 10) / 10, reviewCount: reviews.length };
    }));
  };

  return (
    <Ctx.Provider value={{
      products, cart, wishlist, orders,
      addToCart, removeFromCart, setQuantity, clearCart,
      toggleWishlist, placeOrder, updateOrderStatus,
      deleteOrder,
      addProduct, updateProduct, deleteProduct, addReview,
      refreshProducts,
      cartCount, cartTotal,
    }}>{children}</Ctx.Provider>
  );
};

export const useShop = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used in ShopProvider");
  return c;
};
import { Router } from "express";
import { z } from "zod";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
  shipping: z.object({
    fullName: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    zip: z.string().min(3),
    country: z.string().min(2),
    phone: z.string().min(7),
  }),
  payment: z.object({
    method: z.string(),
    last4: z.string().optional(),
    transactionId: z.string().optional(),
  }),
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const data = orderSchema.parse(req.body);
    const products = await Product.find({ _id: { $in: data.items.map((i) => i.productId) } });
    const items = data.items.map((i) => {
      const p = products.find((p) => p._id.toString() === i.productId);
      if (!p) throw Object.assign(new Error("Product not found"), { status: 400 });
      if (p.stock < i.quantity) throw Object.assign(new Error(`Insufficient stock: ${p.name}`), { status: 400 });
      return { productId: p._id, name: p.name, image: p.image, price: p.price, quantity: i.quantity };
    });
    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      userName: req.user.name,
      items, total,
      shipping: data.shipping,
      payment: data.payment,
    });
    // decrement stock
    await Promise.all(items.map((i) =>
      Product.updateOne({ _id: i.productId }, { $inc: { stock: -i.quantity } })
    ));
    res.status(201).json(order);
  } catch (e) { next(e); }
});

router.get("/mine", requireAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const status = z.enum(["pending", "shipped", "delivered", "cancelled"]).parse(req.body.status);
    const o = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!o) return res.status(404).json({ message: "Not found" });
    res.json(o);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const o = await Order.findByIdAndDelete(req.params.id);
    if (!o) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
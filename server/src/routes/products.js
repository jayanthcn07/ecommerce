import { Router } from "express";
import { z } from "zod";
import { Product } from "../models/Product.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { category, q, sort, min, max } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.name = { $regex: String(q), $options: "i" };
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }
    const sortMap = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      "rating": { rating: -1 },
      "newest": { createdAt: -1 },
    };
    const products = await Product.find(filter).sort(sortMap[sort] || { createdAt: -1 });
    res.json(products);
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (e) { next(e); }
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  mrp: z.number().positive().optional(),
  image: z.string().optional(),
  category: z.string().min(1),
  brand: z.string().optional(),
  stock: z.number().int().nonnegative().default(0),
  features: z.array(z.string()).default([]),
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);
    const p = await Product.create(data);
    res.status(201).json(p);
  } catch (e) { next(e); }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const p = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (e) { next(e); }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(2000).optional(),
});

router.post("/:id/reviews", requireAuth, async (req, res, next) => {
  try {
    const data = reviewSchema.parse(req.body);
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    p.reviews.unshift({ ...data, user: req.user.name });
    p.recomputeRating();
    await p.save();
    res.status(201).json(p);
  } catch (e) { next(e); }
});

export default router;
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const u = await User.findById(req.user._id).populate("wishlist");
  res.json(u.wishlist);
});

router.post("/:productId", requireAuth, async (req, res) => {
  const u = await User.findById(req.user._id);
  const id = req.params.productId;
  const exists = u.wishlist.some((w) => w.toString() === id);
  u.wishlist = exists ? u.wishlist.filter((w) => w.toString() !== id) : [...u.wishlist, id];
  await u.save();
  res.json({ wishlist: u.wishlist, added: !exists });
});

export default router;
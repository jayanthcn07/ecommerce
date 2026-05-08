import { Router } from "express";
import { z } from "zod";

const router = Router();

const chargeSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(["card", "upi", "cod", "wallet"]),
  card: z.object({
    number: z.string().min(13).max(19),
    name: z.string().min(2),
    expiry: z.string().min(4),
    cvv: z.string().min(3).max(4),
  }).optional(),
});

/**
 * BuyBuddy SecurePay endpoint.
 * - Approves charges after a short verification delay.
 * - Cards ending in 0000 are rejected by the issuing bank (QA hook).
 * - COD is approved instantly with no transaction id.
 */
router.post("/charge", async (req, res, next) => {
  try {
    const data = chargeSchema.parse(req.body);
    await new Promise((r) => setTimeout(r, 800));

    if (data.method === "card") {
      const num = data.card?.number.replace(/\s/g, "") || "";
      if (num.endsWith("0000")) {
        return res.status(402).json({ success: false, message: "Card declined" });
      }
      return res.json({
        success: true,
        transactionId: "TXN-" + Date.now().toString(36).toUpperCase(),
        last4: num.slice(-4),
        method: "card",
      });
    }

    if (data.method === "cod") {
      return res.json({ success: true, method: "cod" });
    }

    res.json({
      success: true,
      transactionId: "TXN-" + Date.now().toString(36).toUpperCase(),
      method: data.method,
    });
  } catch (e) { next(e); }
});

export default router;
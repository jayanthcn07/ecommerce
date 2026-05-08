import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { seedIfEmpty } from "./seedIfEmpty.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import wishlistRoutes from "./routes/wishlist.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payments.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

// CORS — accept a comma-separated list of origins, or all in dev.
const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: origins.length ? origins : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // 10mb to accept base64 images
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// ---- SPA fallback ----
// If the frontend has been built (client/dist or ../dist), serve it AND fall
// back to index.html for any non-/api path. This makes deep-link refreshes
// (e.g. /products, /orders, /admin) keep the user on the same page instead of
// hitting "Cannot GET /xyz" or being redirected to "/".
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const candidates = [
  path.resolve(__dirname, "../../client/dist"),
  path.resolve(__dirname, "../../dist"),
  path.resolve(__dirname, "../public"),
];
const clientDist = candidates.find((p) => fs.existsSync(path.join(p, "index.html")));

if (clientDist) {
  console.log(`📦 Serving frontend from ${clientDist}`);
  app.use(express.static(clientDist));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  // Dev mode: no built frontend present. Vite dev server handles SPA routing
  // on its own port; this API just exposes a health check at "/".
  app.get("/", (_req, res) => res.json({ ok: true, service: "buybuddy-api" }));
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedIfEmpty();
    app.listen(PORT, () =>
      console.log(`✅ BuyBuddy API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });
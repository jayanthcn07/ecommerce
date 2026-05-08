import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { seedProducts } from "./seedData.js";

/**
 * Auto-seed on first boot. Idempotent: only runs when DB is empty AND
 * AUTO_SEED env var is "true". Safe to leave enabled — it becomes a no-op
 * once products exist.
 */
export async function seedIfEmpty() {
  if (process.env.AUTO_SEED !== "true") return;
  try {
    const [productCount, userCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
    ]);
    if (productCount > 0 && userCount > 0) {
      console.log("ℹ️  AUTO_SEED on, but DB already populated — skipping.");
      return;
    }
    console.log("🌱 Empty DB detected — seeding…");
    const hash = (p) => bcrypt.hashSync(p, 10);
    const adminPw = process.env.SEED_ADMIN_PASSWORD;
    const userPw = process.env.SEED_USER_PASSWORD;
    if (!adminPw || !userPw) {
      console.warn(
        "⚠️  SEED_ADMIN_PASSWORD / SEED_USER_PASSWORD not set — skipping user seed."
      );
    } else if (userCount === 0) {
      await User.insertMany([
        { name: "Admin", email: "admin@buybuddy.local", password: hash(adminPw), role: "admin" },
        { name: "Demo User", email: "demo@buybuddy.local", password: hash(userPw), role: "user" },
      ]);
      console.log("  ✅ 2 users created");
    }
    if (productCount === 0) {
      await Product.insertMany(seedProducts);
      console.log(`  ✅ ${seedProducts.length} products created`);
    }
    console.log("✅ Seed complete");
  } catch (err) {
    console.error("❌ seedIfEmpty failed:", err.message);
  }
}
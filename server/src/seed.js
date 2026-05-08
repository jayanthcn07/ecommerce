import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import mongoose from "mongoose";
import { seedProducts as products } from "./seedData.js";

async function run() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

  const hash = (p) => bcrypt.hashSync(p, 10);
  // NOTE: change these credentials before running anywhere public.
  await User.insertMany([
    { name: "Admin", email: "admin@buybuddy.local", password: hash(process.env.SEED_ADMIN_PASSWORD || "ChangeMe!123"), role: "admin" },
    { name: "Demo User", email: "demo@buybuddy.local", password: hash(process.env.SEED_USER_PASSWORD || "ChangeMe!123"), role: "user" },
  ]);

  await Product.insertMany(products);
  console.log(`✅ Seeded ${products.length} products and 2 users`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });

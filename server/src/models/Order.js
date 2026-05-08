import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: String,
    items: [orderItemSchema],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shipping: {
      fullName: String,
      address: String,
      city: String,
      zip: String,
      country: String,
      phone: String,
    },
    payment: {
      method: String,
      last4: String,
      transactionId: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
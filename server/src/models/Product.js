import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    body: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    mrp: Number,
    image: String, // URL or base64 data-URI
    category: { type: String, required: true },
    brand: String,
    stock: { type: Number, default: 0 },
    features: [String],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

productSchema.methods.recomputeRating = function () {
  this.reviewCount = this.reviews.length;
  this.rating = this.reviewCount
    ? Math.round(
        (this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviewCount) * 10
      ) / 10
    : 0;
};

export const Product = mongoose.model("Product", productSchema);
import headphones from "@/assets/p-headphones.jpg";
import smartwatch from "@/assets/p-smartwatch.jpg";
import laptop from "@/assets/p-laptop.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import backpack from "@/assets/p-backpack.jpg";
import coffee from "@/assets/p-coffee.jpg";
import books from "@/assets/p-books.jpg";
import speaker from "@/assets/p-speaker.jpg";

export type Review = {
  id: string;
  user: string;
  rating: number;
  title: string;
  body: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  brand: string;
  features: string[];
};

export const CATEGORIES = [
  "Electronics",
  "Wearables",
  "Computers",
  "Footwear",
  "Fashion",
  "Home & Kitchen",
  "Books",
  "Audio",
];

const r = (u: string, rating: number, title: string, body: string, d: string): Review => ({
  id: crypto.randomUUID(),
  user: u, rating, title, body, date: d,
});

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "AeroSound Pro Wireless Headphones (ANC)",
    description: "Immersive over-ear headphones with active noise cancellation, 40h battery life, and studio-grade audio drivers for unmatched sound clarity.",
    price: 14999, mrp: 24990, image: headphones, category: "Audio", stock: 24,
    rating: 4.6, reviewCount: 1284, brand: "AeroSound",
    features: ["Active Noise Cancellation", "40h battery life", "Bluetooth 5.3", "Memory foam ear cushions", "Built-in mic"],
    reviews: [
      r("Priya S.", 5, "Best purchase this year", "ANC is fantastic and the bass is rich without being overwhelming.", "2025-09-12"),
      r("Marcus T.", 4, "Great value", "Comfortable for long sessions. Battery easily lasts a week.", "2025-08-04"),
    ],
  },
  {
    id: "p2",
    name: "Pulse Series 8 Smartwatch",
    description: "Track your fitness, sleep, and notifications with a vibrant AMOLED always-on display and 7-day battery life.",
    price: 17999, mrp: 26999, image: smartwatch, category: "Wearables", stock: 41,
    rating: 4.4, reviewCount: 856, brand: "Pulse",
    features: ["Heart-rate & SpO2", "GPS tracking", "5 ATM water resistance", "7-day battery", "100+ workouts"],
    reviews: [
      r("Alex K.", 5, "Replaces my Apple Watch", "Accurate fitness tracking and looks premium.", "2025-10-01"),
    ],
  },
  {
    id: "p3",
    name: "Zenith UltraBook 14 (Core i7, 16GB/512GB)",
    description: "Lightweight 14\" laptop with a brilliant Retina display, 16GB RAM, 512GB SSD, and all-day battery life.",
    price: 89990, mrp: 109990, image: laptop, category: "Computers", stock: 12,
    rating: 4.7, reviewCount: 412, brand: "Zenith",
    features: ["Intel Core i7 13th Gen", "16GB DDR5 RAM", "512GB NVMe SSD", "14\" 2.8K display", "Backlit keyboard"],
    reviews: [r("Diana R.", 5, "Blazing fast", "Boots in seconds. Fan barely runs.", "2025-07-19")],
  },
  {
    id: "p4",
    name: "Strider Cloud Running Sneakers",
    description: "Engineered cushioning with a breathable knit upper for daily runs and all-day comfort.",
    price: 4999, mrp: 7999, image: sneakers, category: "Footwear", stock: 73,
    rating: 4.3, reviewCount: 2104, brand: "Strider",
    features: ["Cloud foam midsole", "Breathable knit upper", "Reflective accents", "Lightweight 250g", "Available in 6 colors"],
    reviews: [r("Sam P.", 4, "Comfortable", "Great for casual runs and gym.", "2025-06-30")],
  },
  {
    id: "p5",
    name: "Heritage Leather Backpack",
    description: "Premium full-grain leather backpack with padded laptop compartment fits up to 16\" devices.",
    price: 6499, mrp: 9999, image: backpack, category: "Fashion", stock: 18,
    rating: 4.5, reviewCount: 312, brand: "Heritage Co.",
    features: ["Full-grain leather", "16\" laptop compartment", "Brass hardware", "Water-resistant lining"],
    reviews: [r("Lara V.", 5, "Beautiful craftsmanship", "Looks better with age.", "2025-05-15")],
  },
  {
    id: "p6",
    name: "Brewmaster Pro Espresso Machine",
    description: "Café-quality espresso at home with 15-bar pressure pump, milk frother, and precision temperature control.",
    price: 24999, mrp: 34999, image: coffee, category: "Home & Kitchen", stock: 9,
    rating: 4.6, reviewCount: 587, brand: "Brewmaster",
    features: ["15-bar pump", "Steam wand", "Removable water tank", "Stainless steel body"],
    reviews: [r("Jonas M.", 5, "Café at home", "Pulls great shots out of the box.", "2025-08-22")],
  },
  {
    id: "p7",
    name: "Bestseller Book Bundle (Set of 10)",
    description: "Curated collection of 10 international bestsellers spanning fiction, non-fiction, and biographies.",
    price: 1999, mrp: 3499, image: books, category: "Books", stock: 50,
    rating: 4.8, reviewCount: 943, brand: "Pageturner",
    features: ["10 hardcover books", "Curated bestsellers", "Gift-ready packaging"],
    reviews: [r("Iris N.", 5, "Amazing value", "Got hours of reading for the price of two books.", "2025-09-02")],
  },
  {
    id: "p8",
    name: "BoomBox Mini Portable Speaker",
    description: "Compact 360° speaker with deep bass, 24-hour playback, and IPX7 waterproofing.",
    price: 2499, mrp: 3999, image: speaker, category: "Audio", stock: 88,
    rating: 4.2, reviewCount: 1788, brand: "BoomBox",
    features: ["360° sound", "24h playback", "IPX7 waterproof", "Bluetooth 5.0"],
    reviews: [r("Kenji O.", 4, "Punches above its size", "Loud and clear for outdoor use.", "2025-07-11")],
  },
];

// ---- Extended catalog ---------------------------------------------------

const variants: Array<Omit<Product, "id">> = [
  {
    name: "AeroSound Studio Wired Headphones",
    description: "Reference-grade wired headphones tuned for mixing engineers and audiophiles.",
    price: 9999, mrp: 13999, image: headphones, category: "Audio", brand: "AeroSound", stock: 32,
    rating: 4.5, reviewCount: 421,
    features: ["Detachable cable", "Open-back design", "50mm drivers", "Velour pads"],
    reviews: [r("Yuki H.", 5, "Reference quality", "Crystal mids, deep bass when sealed.", "2025-09-01")],
  },
  {
    name: "AeroSound Buds Pro 3 (Adaptive ANC)",
    description: "True-wireless earbuds with adaptive ANC and a featherweight charging case.",
    price: 5999, mrp: 9999, image: headphones, category: "Audio", brand: "AeroSound", stock: 120,
    rating: 4.4, reviewCount: 2310,
    features: ["Adaptive ANC", "Wireless charging", "IPX5", "32h with case"],
    reviews: [r("Marco V.", 4, "Great daily driver", "Comfy, solid call quality.", "2025-08-20")],
  },
  {
    name: "Pulse Active 5 Fitness Watch",
    description: "Lightweight fitness tracker with built-in GPS and 14-day battery.",
    price: 4999, mrp: 7999, image: smartwatch, category: "Wearables", brand: "Pulse", stock: 60,
    rating: 4.3, reviewCount: 1180,
    features: ["14-day battery", "Built-in GPS", "Sleep tracking", "Silicone strap"],
    reviews: [r("Hana B.", 4, "All I need", "Tracks runs perfectly.", "2025-07-22")],
  },
  {
    name: "Pulse Kids GPS Smartwatch",
    description: "Safe, durable smartwatch for kids with two-way calling and live location.",
    price: 3499, mrp: 4999, image: smartwatch, category: "Wearables", brand: "Pulse", stock: 45,
    rating: 4.2, reviewCount: 612,
    features: ["GPS location", "SOS button", "Two-way calling", "Geo-fencing"],
    reviews: [r("Reema P.", 5, "Peace of mind", "Love the geo-fence alerts.", "2025-06-10")],
  },
  {
    name: "Zenith Pro 16 Creator Workstation",
    description: "16\" creator laptop with discrete graphics, 32GB RAM, and 1TB NVMe storage.",
    price: 149990, mrp: 179990, image: laptop, category: "Computers", brand: "Zenith", stock: 7,
    rating: 4.7, reviewCount: 198,
    features: ["16\" 4K OLED", "32GB DDR5", "1TB NVMe", "RTX graphics"],
    reviews: [r("Owen T.", 5, "Renders fly", "Handles 4K timelines effortlessly.", "2025-08-15")],
  },
  {
    name: "Zenith Air 13 Ultra-Light",
    description: "Ultra-portable 13\" laptop weighing under 1 kg with all-day battery.",
    price: 64990, mrp: 79990, image: laptop, category: "Computers", brand: "Zenith", stock: 22,
    rating: 4.5, reviewCount: 540,
    features: ["< 1 kg", "18h battery", "13.3\" IPS", "Aluminum body"],
    reviews: [r("Lila A.", 5, "Travel champion", "Fits in any bag.", "2025-09-25")],
  },
  {
    name: "Strider Trail Hiker GTX",
    description: "Waterproof hiking shoe with aggressive lugs for technical trails.",
    price: 6499, mrp: 8999, image: sneakers, category: "Footwear", brand: "Strider", stock: 38,
    rating: 4.4, reviewCount: 720,
    features: ["GORE-TEX lining", "Vibram outsole", "Toe cap", "TPU midfoot shank"],
    reviews: [r("Greg N.", 4, "Solid grip", "Held up on a wet 14er.", "2025-06-02")],
  },
  {
    name: "Strider Court Classic Sneakers",
    description: "Retro-court leather sneakers that pair with anything.",
    price: 2999, mrp: 4499, image: sneakers, category: "Footwear", brand: "Strider", stock: 110,
    rating: 4.1, reviewCount: 410,
    features: ["Leather upper", "Cushioned insole", "Vulcanized sole"],
    reviews: [r("Mira S.", 4, "Goes with everything", "Clean look, comfy.", "2025-05-14")],
  },
  {
    name: "Heritage Weekend Leather Duffel",
    description: "Vegetable-tanned leather duffel sized for a 2-night trip.",
    price: 8999, mrp: 12999, image: backpack, category: "Fashion", brand: "Heritage Co.", stock: 14,
    rating: 4.6, reviewCount: 156,
    features: ["Vegetable-tanned leather", "Brass YKK zippers", "Cotton lining"],
    reviews: [r("Dan W.", 5, "Heirloom quality", "Will last decades.", "2025-04-18")],
  },
  {
    name: "Heritage Slim Card Holder",
    description: "Slim 6-card minimalist wallet in vintage tan leather.",
    price: 999, mrp: 1799, image: backpack, category: "Fashion", brand: "Heritage Co.", stock: 200,
    rating: 4.5, reviewCount: 980,
    features: ["6 card slots", "RFID-blocking", "Slim profile"],
    reviews: [r("Theo R.", 5, "Perfect EDC", "Slim and elegant.", "2025-03-09")],
  },
  {
    name: "Brewmaster Grinder X (Conical Burr)",
    description: "Conical burr grinder with 40 precision settings for any brew method.",
    price: 7999, mrp: 11999, image: coffee, category: "Home & Kitchen", brand: "Brewmaster", stock: 25,
    rating: 4.5, reviewCount: 312,
    features: ["Conical burrs", "40 settings", "Quiet motor"],
    reviews: [r("Eli K.", 5, "Espresso ready", "Dial-in is a breeze.", "2025-09-04")],
  },
  {
    name: "Brewmaster Gooseneck Pour-Over Kettle",
    description: "Gooseneck electric kettle with 1°F temperature control.",
    price: 4499, mrp: 5999, image: coffee, category: "Home & Kitchen", brand: "Brewmaster", stock: 40,
    rating: 4.4, reviewCount: 510,
    features: ["Variable temp", "Hold mode", "Stainless steel"],
    reviews: [r("Nina F.", 4, "Perfect pour", "Great control over flow.", "2025-07-27")],
  },
  {
    name: "Pageturner Sci-Fi Hardcover Box Set",
    description: "Five award-winning sci-fi novels in a collector's box.",
    price: 1499, mrp: 2499, image: books, category: "Books", brand: "Pageturner", stock: 80,
    rating: 4.7, reviewCount: 245,
    features: ["5 hardcovers", "Collector's box", "Embossed covers"],
    reviews: [r("Ade O.", 5, "Stunning gift", "Beautifully presented.", "2025-08-30")],
  },
  {
    name: "Pageturner Cookbook of the Year",
    description: "200 modern recipes with full-page photography for the home cook.",
    price: 899, mrp: 1499, image: books, category: "Books", brand: "Pageturner", stock: 150,
    rating: 4.6, reviewCount: 1290,
    features: ["200 recipes", "Hardcover", "Photo per recipe"],
    reviews: [r("Sal M.", 5, "Inspiring", "Tried 10 recipes already.", "2025-09-19")],
  },
  {
    name: "BoomBox Studio 2 Bookshelf Speakers",
    description: "Active 2.0 bookshelf speakers with HDMI ARC for your TV setup.",
    price: 18999, mrp: 24999, image: speaker, category: "Audio", brand: "BoomBox", stock: 18,
    rating: 4.5, reviewCount: 187,
    features: ["HDMI ARC", "Bluetooth 5.0", "Optical input", "Phono preamp"],
    reviews: [r("Iris K.", 5, "Replaced my soundbar", "Way better imaging.", "2025-08-12")],
  },
  {
    name: "BoomBox Party Cube XL",
    description: "Bass-heavy outdoor speaker with party lights and 18h battery.",
    price: 8999, mrp: 12999, image: speaker, category: "Audio", brand: "BoomBox", stock: 33,
    rating: 4.3, reviewCount: 612,
    features: ["LED light show", "Mic input", "TWS pairing", "IPX5"],
    reviews: [r("Rohan G.", 4, "Loud!", "Filled the backyard easily.", "2025-07-05")],
  },
];

SEED_PRODUCTS.push(
  ...variants.map((v, i) => ({ ...v, id: `p${100 + i}` }))
);

import { Facebook, Instagram, Twitter, Youtube, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const Footer = () => (
  <footer className="bg-header text-header-foreground mt-16">
    <div className="container px-4 py-10 grid gap-8 md:grid-cols-4">
      <div>
        <h3 className="font-bold mb-3 inline-flex items-center gap-2">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-buy text-accent-foreground font-black shadow-pop">B</span>
          <span><span className="text-accent">Buy</span>Buddy</span>
        </h3>
        <p className="text-sm text-white/70">Your everything store. Quality products, lightning-fast delivery, unbeatable prices.</p>
        <div className="flex gap-3 mt-4">
          {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
            <a key={i} href="#" aria-label="social" className="h-8 w-8 grid place-items-center rounded-full bg-white/5 hover:bg-accent hover:text-accent-foreground transition-all hover:-translate-y-0.5">
              <I size={15} />
            </a>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Get to know us</h4>
        <ul className="space-y-1.5 text-sm text-white/70">
          <li className="hover:text-accent cursor-pointer transition">About BuyBuddy</li>
          <li className="hover:text-accent cursor-pointer transition">Careers</li>
          <li className="hover:text-accent cursor-pointer transition">Press releases</li>
          <li className="hover:text-accent cursor-pointer transition">Sustainability</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Help & support</h4>
        <ul className="space-y-1.5 text-sm text-white/70">
          <li className="hover:text-accent cursor-pointer transition">Shipping & delivery</li>
          <li className="hover:text-accent cursor-pointer transition">Returns & refunds</li>
          <li className="hover:text-accent cursor-pointer transition">Track your order</li>
          <li className="hover:text-accent cursor-pointer transition">FAQ & contact</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm">Why BuyBuddy?</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-center gap-2"><Truck size={14} className="text-accent" />Free shipping over ₹499</li>
          <li className="flex items-center gap-2"><RotateCcw size={14} className="text-accent" />Easy 30-day returns</li>
          <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-accent" />100% secure payments</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
      © {new Date().getFullYear()} BuyBuddy. Crafted with care for shoppers everywhere.
    </div>
  </footer>
);

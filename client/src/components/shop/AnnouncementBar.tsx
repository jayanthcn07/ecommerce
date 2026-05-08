import { Sparkles, Truck, Tag, BadgePercent } from "lucide-react";

const items = [
  { i: BadgePercent, t: "Use code BUDDY10 for an extra 10% off your first order" },
  { i: Truck, t: "Free express shipping on orders over ₹499" },
  { i: Tag, t: "Mega Sale Live — up to 60% off across electronics" },
  { i: Sparkles, t: "New: Pay-Later & 6-month no-cost EMI on all major cards" },
];

/** Top-of-page animated marquee promo bar — runs infinite. */
export const AnnouncementBar = () => {
  // duplicate the list so the marquee is seamless
  const loop = [...items, ...items];
  return (
    <div className="bg-gradient-to-r from-accent via-buy to-accent bg-[length:200%_100%] animate-gradient-pan text-accent-foreground text-xs font-medium overflow-hidden">
      <div className="container px-4">
        <div className="flex animate-marquee whitespace-nowrap py-1.5 gap-12 w-max">
          {loop.map(({ i: Icon, t }, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <Icon size={13} />{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
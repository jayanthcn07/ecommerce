import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating scroll-to-top button with animated progress ring. */
export const ScrollToTop = () => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      setProgress(Math.min(1, Math.max(0, pct)));
      setShow(h.scrollTop > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;
  const C = 2 * Math.PI * 18;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-accent text-accent-foreground shadow-pop grid place-items-center hover:scale-110 active:scale-95 transition-transform animate-scale-in"
    >
      <svg className="absolute inset-0" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" stroke="hsl(var(--accent-foreground) / 0.2)" strokeWidth="3" fill="none" />
        <circle
          cx="22" cy="22" r="18"
          stroke="hsl(var(--accent-foreground))" strokeWidth="3" fill="none"
          strokeLinecap="round" strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          transform="rotate(-90 22 22)"
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <ArrowUp size={18} className="relative" />
    </button>
  );
};
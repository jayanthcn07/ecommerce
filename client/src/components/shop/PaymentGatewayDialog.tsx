import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Loader2, Lock, ShieldCheck, XCircle, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

type Stage = "auth" | "verify" | "approve" | "success" | "failed";

type Props = {
  open: boolean;
  amount: number;
  method: string;
  cardLast4?: string;
  forceFail?: boolean;
  onClose: () => void;
  onComplete: (result: { success: boolean; transactionId?: string }) => void;
};

const stages: { key: Stage; label: string; ms: number }[] = [
  { key: "auth", label: "Securely contacting payment gateway", ms: 900 },
  { key: "verify", label: "Verifying card details", ms: 1100 },
  { key: "approve", label: "Awaiting bank approval", ms: 1200 },
];

/**
 * BuyBuddy SecurePay — animated multi-step checkout flow.
 */
export const PaymentGatewayDialog = ({
  open, amount, method, cardLast4, forceFail, onClose, onComplete,
}: Props) => {
  const [stage, setStage] = useState<Stage>("auth");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStage("auth"); setStep(0);
    let cancelled = false;
    let i = 0;
    const run = () => {
      if (cancelled) return;
      if (i >= stages.length) {
        const ok = !forceFail;
        const final: Stage = ok ? "success" : "failed";
        setStage(final);
        setTimeout(() => {
          if (!cancelled) onComplete({
            success: ok,
            transactionId: ok ? "TXN-" + Date.now().toString(36).toUpperCase() : undefined,
          });
        }, 900);
        return;
      }
      setStage(stages[i].key); setStep(i);
      setTimeout(() => { i++; run(); }, stages[i].ms);
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, forceFail]);

  const done = stage === "success" || stage === "failed";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && done) onClose(); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-pop">
        {/* Animated banner */}
        <div className="relative bg-gradient-hero text-header-foreground p-5 overflow-hidden">
          <div className="blob bg-accent w-48 h-48 -top-10 -right-10 animate-blob" />
          <div className="blob bg-buy w-40 h-40 -bottom-10 -left-10 animate-blob" style={{ animationDelay: "-5s" }} />
          <div className="relative flex items-center justify-between text-xs font-semibold opacity-90">
            <span className="inline-flex items-center gap-1.5"><Lock size={14} /> BUYBUDDY SECUREPAY</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard size={14} /> Encrypted</span>
          </div>
          <DialogHeader className="relative mt-2 space-y-0">
            <DialogTitle className="text-2xl text-header-foreground">{formatPrice(amount)}</DialogTitle>
            <DialogDescription className="text-white/70 capitalize">
              {method === "card" && cardLast4 ? `Card ending in ${cardLast4}` : `Paying via ${method}`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {!done && (
            <ul className="space-y-3">
              {stages.map((s, idx) => {
                const state =
                  idx < step ? "done" : idx === step ? "active" : "pending";
                return (
                  <li key={s.key} className="flex items-center gap-3 text-sm">
                    <span className="relative w-6 h-6 grid place-items-center">
                      {state === "done" && (
                        <CheckCircle2 className="text-success animate-scale-in" size={22} />
                      )}
                      {state === "active" && (
                        <>
                          <span className="absolute inset-0 rounded-full bg-accent/30 animate-pulse-ring" />
                          <Loader2 className="text-accent animate-spin" size={20} />
                        </>
                      )}
                      {state === "pending" && (
                        <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                      )}
                    </span>
                    <span className={state === "pending" ? "text-muted-foreground" : "text-foreground font-medium"}>
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          {stage === "success" && (
            <div className="text-center py-4 animate-scale-in">
              <div className="mx-auto w-16 h-16 rounded-full bg-success/15 grid place-items-center relative">
                <span className="absolute inset-0 rounded-full bg-success/30 animate-pulse-ring" />
                <CheckCircle2 className="text-success" size={36} />
              </div>
              <h3 className="font-bold text-lg mt-3">Payment approved</h3>
              <p className="text-sm text-muted-foreground">Finalizing your order…</p>
            </div>
          )}

          {stage === "failed" && (
            <div className="text-center py-4 animate-scale-in">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/15 grid place-items-center">
                <XCircle className="text-destructive" size={36} />
              </div>
              <h3 className="font-bold text-lg mt-3">Payment declined</h3>
              <p className="text-sm text-muted-foreground">Your bank rejected this charge. Try a different card.</p>
              <Button onClick={onClose} className="mt-4" variant="outline">Close</Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground border-t pt-3">
            <ShieldCheck size={12} /> 256-bit TLS · PCI-DSS Level 1 · Powered by BuyBuddy SecurePay
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
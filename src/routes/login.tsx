import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function BrandMark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[oklch(0.55_0.18_25)] grid place-items-center shadow-lg shadow-primary/30 ring-1 ring-white/20">
        <span className="text-white font-bold text-[15px] tracking-tight leading-none">N7</span>
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold tracking-tight">N7 Back Office</div>
        <div className="text-[11px] opacity-60">AI Customer Service</div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — N7 Back Office" },
      { name: "description", content: "Connectez-vous à la plateforme N7." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@n7group.com");
  const [password, setPassword] = useState("N7@admin2026");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      localStorage.setItem("n7_session", JSON.stringify({ email, at: Date.now() }));
    } catch {}
    toast.success("Connecté");
    navigate({ to: "/" });
  }

  return (
    <div className="relative min-h-screen w-full grid lg:grid-cols-[1.1fr_1fr] overflow-hidden bg-background text-foreground">
      {/* ==== LEFT: brand panel ==== */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[oklch(0.16_0.02_270)] text-white">
        {/* animated ambient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-primary/30 blur-[110px]" />
          <div className="absolute bottom-[-160px] right-[-120px] h-[460px] w-[460px] rounded-full bg-[oklch(0.55_0.14_260)]/40 blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
          <div className="absolute inset-0 [background-image:linear-gradient(to_bottom,transparent,oklch(0.12_0.02_270)_95%)]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative flex items-center gap-3"
        >
          <BrandMark className="text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative max-w-md"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1 text-[11px] font-medium text-white/80">
            <Sparkles className="h-3 w-3 text-primary" />
            Agent IA · En ligne
          </div>
          <h2 className="mt-5 text-3xl xl:text-4xl font-semibold leading-[1.15] tracking-tight">
            Pilotez votre relation client,<br />
            <span className="text-primary">alimentée par l'IA.</span>
          </h2>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Qualification prospects, calendrier partagé, base de connaissances et intégrations —
            réunis dans un seul back office pensé pour vos équipes.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              { icon: Zap, label: "Réponses instantanées, 24/7" },
              { icon: ShieldCheck, label: "Données hébergées & sécurisées" },
              { icon: Sparkles, label: "Intégré à Meet, WhatsApp, Gmail…" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-white/85">
                <div className="h-8 w-8 rounded-lg bg-white/10 grid place-items-center ring-1 ring-white/10">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                {f.label}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative text-[11px] text-white/50">
          © {new Date().getFullYear()} N7 Communication Group. Tous droits réservés.
        </div>
      </div>

      {/* ==== RIGHT: form panel ==== */}
      <div className="relative flex items-center justify-center p-6 sm:p-10">
        {/* soft ambient for light side */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-[-140px] left-[-100px] h-[380px] w-[380px] rounded-full bg-[oklch(0.75_0.09_260)]/25 blur-3xl" />
          <div className="absolute inset-0 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--color-border)_50%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-border)_50%,transparent)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* mobile logo */}
          <div className="lg:hidden mb-6 flex flex-col items-center text-center">
            <img src={n7Logo} alt="N7" className="h-10 w-auto" />
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight">Bon retour 👋</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Connectez-vous pour accéder au back office N7.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email
              </Label>
              <div className="group relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 rounded-xl bg-card/60 backdrop-blur border-border/70 shadow-soft focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Mot de passe
                </Label>
                <button type="button" className="text-[11px] text-primary hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="group relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-10 rounded-xl bg-card/60 backdrop-blur border-border/70 shadow-soft focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group w-full h-11 rounded-xl font-medium shadow-glow hover:shadow-elevated transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

        </motion.div>
      </div>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const n7Logo = "https://n7.ma/wp-content/uploads/2025/06/n7-mobile-logo.png";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — N7 Back Office" },
      { name: "description", content: "Connectez-vous à la plateforme N7 AI Customer Service." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@n7group.com");
  const [password, setPassword] = useState("N7@admin2026");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    try {
      localStorage.setItem("n7_session", JSON.stringify({ email, at: Date.now() }));
    } catch {}
    toast.success("Bienvenue, Yassine 👋");
    navigate({ to: "/" });
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-160px] h-[560px] w-[560px] rounded-full bg-info/20 blur-3xl" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,color-mix(in_oklab,var(--color-border)_60%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-border)_60%,transparent)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)] opacity-40" />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* left: form */}
        <div className="flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="flex items-center gap-3 mb-8">
              <img src={n7Logo} alt="N7" className="h-10 w-auto" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">N7 Back Office</div>
                <div className="text-xs text-muted-foreground">AI Customer Service</div>
              </div>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">Bon retour 👋</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Connectez-vous pour gérer vos prospects et votre Service Client AI.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 pl-10 rounded-xl bg-card/60 backdrop-blur border-border/70 shadow-soft focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm">Mot de passe</Label>
                  <button type="button" className="text-xs font-medium text-primary hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pl-10 rounded-xl bg-card/60 backdrop-blur border-border/70 shadow-soft focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                Se souvenir de moi pendant 30 jours
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl text-sm font-semibold shadow-glow hover:shadow-elevated transition-shadow"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
              </Button>

              <div className="rounded-xl border border-dashed border-primary/30 bg-accent/40 p-3 text-xs">
                <div className="font-semibold text-foreground mb-1">Compte de démonstration</div>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-muted-foreground">
                  <span>Email</span><span className="font-mono text-foreground">admin@n7group.com</span>
                  <span>Mot de passe</span><span className="font-mono text-foreground">N7@admin2026</span>
                </div>
              </div>
            </form>
          </motion.div>
        </div>

        {/* right: brand panel */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-[#7a2d05]" />
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 max-w-md px-10 text-primary-foreground"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Propulsé par N7 AI
            </div>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight">
              Automatisez votre service client, qualifiez plus de prospects.
            </h2>
            <p className="mt-4 text-white/85">
              La plateforme unifiée pour votre équipe commerciale, marketing et support — avec des agents IA
              entraînés sur votre propre base de connaissances.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { k: "96%", v: "Taux de réponse" },
                { k: "24/7", v: "Disponibilité" },
                { k: "4×", v: "Prospects qualifiés" },
              ].map((s) => (
                <div key={s.k} className="rounded-xl bg-white/10 p-3 backdrop-blur">
                  <div className="text-2xl font-semibold">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-wide text-white/70">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

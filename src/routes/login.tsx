import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const n7Logo = "https://n7.ma/wp-content/uploads/2025/06/n7-mobile-logo.png";

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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-120px] h-[440px] w-[440px] rounded-full bg-info/15 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-sm rounded-2xl border border-border/70 bg-card/80 backdrop-blur p-8 shadow-elevated"
      >
        <div className="flex flex-col items-center text-center">
          <img src={n7Logo} alt="N7" className="h-10 w-auto" />
          <h1 className="mt-5 text-xl font-semibold tracking-tight">Connexion</h1>
          <p className="mt-1 text-sm text-muted-foreground">Accédez à votre back office N7.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 pl-9 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 pl-9 rounded-lg"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-10 rounded-lg font-medium">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

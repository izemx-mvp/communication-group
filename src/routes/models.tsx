import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Cpu, Sparkles, Zap, Brain, Gauge } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: [
      { title: "Modèles IA — N7 Back Office" },
      { name: "description", content: "Choisissez et configurez le modèle IA de votre assistant." },
    ],
  }),
  component: ModelsPage,
});

type Family = "OpenAI" | "Anthropic" | "Google" | "Mistral";

interface AIModel {
  id: string;
  name: string;
  family: Family;
  tagline: string;
  strengths: string[];
  speed: number; // 1-5
  quality: number; // 1-5
  price: string;
  recommended?: boolean;
  icon: typeof Cpu;
  gradient: string;
}

const models: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    family: "OpenAI",
    tagline: "Polyvalent, rapide, excellent multilingue.",
    strengths: ["Français natif", "Ton commercial", "Rapide"],
    speed: 5, quality: 5, price: "€€",
    recommended: true,
    icon: Sparkles,
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    family: "Anthropic",
    tagline: "Raisonnement fin, réponses nuancées et longues.",
    strengths: ["Analyse", "Rédaction", "Sûreté"],
    speed: 4, quality: 5, price: "€€",
    icon: Brain,
    gradient: "from-orange-500/20 to-amber-500/10",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    family: "Google",
    tagline: "Contexte long, très bon sur documents volumineux.",
    strengths: ["Contexte 1M", "Documents", "Résumés"],
    speed: 4, quality: 4, price: "€",
    icon: Zap,
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    family: "Mistral",
    tagline: "Souverain, hébergé UE, optimisé pour le français.",
    strengths: ["UE / RGPD", "Français", "Économique"],
    speed: 5, quality: 4, price: "€",
    icon: Cpu,
    gradient: "from-rose-500/20 to-pink-500/10",
  },
];

function ModelsPage() {
  const [selected, setSelected] = useState("gpt-4o");
  const [temperature, setTemperature] = useState([0.4]);
  const [maxTokens, setMaxTokens] = useState([1024]);
  const [stream, setStream] = useState(true);
  const [prompt, setPrompt] = useState(
    "Tu es l'assistant du service client N7 Communication Group. Réponds en français, avec un ton chaleureux et professionnel. Utilise uniquement le contenu publié de la base de connaissances.",
  );

  return (
    <div>
      <PageHeader
        title="Modèles IA"
        description="Choisissez le modèle qui propulse votre Service Client AI."
        actions={
          <Button onClick={() => toast.success("Configuration enregistrée")}>Enregistrer</Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {models.map((m, i) => {
          const active = selected === m.id;
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                onClick={() => setSelected(m.id)}
                className={cn(
                  "group text-left w-full rounded-2xl border p-5 transition-all shadow-soft hover:shadow-elevated relative overflow-hidden",
                  active
                    ? "border-primary/60 ring-2 ring-primary/30 bg-card"
                    : "border-border bg-card hover:border-primary/30",
                )}
              >
                <div className={cn("absolute inset-0 -z-0 bg-gradient-to-br opacity-70", m.gradient)} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/80 backdrop-blur border border-border">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {m.recommended && (
                      <Badge className="bg-primary text-primary-foreground">Recommandé</Badge>
                    )}
                    {active && !m.recommended && (
                      <div className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-base font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.family}</div>
                  <p className="mt-2 text-sm text-muted-foreground min-h-[40px]">{m.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.strengths.map((s) => (
                      <Badge key={s} variant="outline" className="bg-background/60 backdrop-blur">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                    <Meter label="Vitesse" value={m.speed} />
                    <Meter label="Qualité" value={m.quality} />
                    <div className="rounded-lg bg-background/60 border border-border p-2">
                      <div className="font-semibold text-foreground">{m.price}</div>
                      <div>Coût</div>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" /> Paramètres du modèle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Label>Température</Label>
                <span className="text-sm font-medium">{temperature[0].toFixed(2)}</span>
              </div>
              <Slider value={temperature} min={0} max={1} step={0.05} onValueChange={setTemperature} className="mt-2" />
              <p className="mt-1 text-xs text-muted-foreground">Plus bas = réponses factuelles. Plus haut = créatif.</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Longueur maximale</Label>
                <span className="text-sm font-medium">{maxTokens[0]} tokens</span>
              </div>
              <Slider value={maxTokens} min={256} max={4096} step={128} onValueChange={setMaxTokens} className="mt-2" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">Streaming des réponses</div>
                <div className="text-xs text-muted-foreground">Affichage progressif pour une meilleure UX.</div>
              </div>
              <Switch checked={stream} onCheckedChange={setStream} />
            </div>
            <div className="space-y-1.5">
              <Label>Prompt système</Label>
              <Textarea rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="font-mono text-sm" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Modèle sélectionné</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const m = models.find((x) => x.id === selected)!;
              const Icon = m.icon;
              return (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.family}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{m.tagline}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <Row k="Vitesse" v={"★".repeat(m.speed) + "☆".repeat(5 - m.speed)} />
                    <Row k="Qualité" v={"★".repeat(m.quality) + "☆".repeat(5 - m.quality)} />
                    <Row k="Coût relatif" v={m.price} />
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-background/60 border border-border p-2">
      <div className="font-semibold text-foreground">{"●".repeat(value)}<span className="text-muted-foreground/40">{"●".repeat(5 - value)}</span></div>
      <div>{label}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

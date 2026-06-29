import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { businessHours } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/business-hours")({
  component: BusinessHoursPage,
});

type Closure = { id: string; name: string; date: string };

function BusinessHoursPage() {
  const [hours, setHours] = useState(businessHours);
  const [holidays, setHolidays] = useState<Closure[]>([
    { id: "h1", name: "Aïd al-Fitr", date: "2026-04-10" },
    { id: "h2", name: "Fête de l'Indépendance", date: "2026-11-18" },
  ]);
  const [closures, setClosures] = useState<Closure[]>([
    { id: "c1", name: "Congés d'été", date: "2026-08-01 — 2026-08-15" },
  ]);
  const [tz, setTz] = useState("africa-casablanca");
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [closureOpen, setClosureOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Horaires d'ouverture</CardTitle>
            <p className="text-sm text-muted-foreground">Utilisés par l'IA pour répondre à « êtes-vous ouverts ? ».</p>
          </div>
          <Button size="sm" onClick={() => toast.success("Horaires enregistrés")}>
            <Save className="h-4 w-4 mr-1.5" /> Enregistrer
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {hours.map((h, i) => (
            <div key={h.day} className="grid grid-cols-[120px_1fr_1fr_auto] items-center gap-3 py-2 border-b last:border-0">
              <div className="font-medium">{h.day}</div>
              <Input type="time" value={h.open} disabled={h.closed} onChange={(e) => {
                const next = [...hours]; next[i] = { ...h, open: e.target.value }; setHours(next);
              }} />
              <Input type="time" value={h.close} disabled={h.closed} onChange={(e) => {
                const next = [...hours]; next[i] = { ...h, close: e.target.value }; setHours(next);
              }} />
              <div className="flex items-center gap-2">
                <Switch checked={h.closed} onCheckedChange={(v) => {
                  const next = [...hours]; next[i] = { ...h, closed: v }; setHours(next);
                }} />
                <Label className="text-sm text-muted-foreground">Fermé</Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Jours fériés</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <div className="font-medium">{h.name}</div>
                  <div className="text-xs text-muted-foreground">{h.date}</div>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                  setHolidays((l) => l.filter((x) => x.id !== h.id));
                  toast.success("Jour férié supprimé");
                }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setHolidayOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Ajouter un jour férié
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Fermetures temporaires et fuseau horaire</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Fuseau horaire</Label>
              <Select value={tz} onValueChange={(v) => { setTz(v); toast.success("Fuseau horaire mis à jour"); }}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa-casablanca">Afrique / Casablanca (GMT+1)</SelectItem>
                  <SelectItem value="europe-paris">Europe / Paris (GMT+1)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {closures.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.date}</div>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                  setClosures((l) => l.filter((x) => x.id !== c.id));
                  toast.success("Fermeture supprimée");
                }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setClosureOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Ajouter une fermeture
            </Button>
          </CardContent>
        </Card>
      </div>

      <ClosureDialog
        open={holidayOpen}
        title="Ajouter un jour férié"
        onClose={() => setHolidayOpen(false)}
        onSave={(c) => { setHolidays((l) => [...l, c]); toast.success("Jour férié ajouté"); setHolidayOpen(false); }}
        dateType="single"
      />
      <ClosureDialog
        open={closureOpen}
        title="Ajouter une fermeture temporaire"
        onClose={() => setClosureOpen(false)}
        onSave={(c) => { setClosures((l) => [...l, c]); toast.success("Fermeture ajoutée"); setClosureOpen(false); }}
        dateType="range"
      />
    </div>
  );
}

function ClosureDialog({
  open, title, onClose, onSave, dateType,
}: {
  open: boolean; title: string; onClose: () => void;
  onSave: (c: Closure) => void; dateType: "single" | "range";
}) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function reset() { setName(""); setStart(""); setEnd(""); }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="ex. Jour de Noël" />
          </div>
          {dateType === "single" ? (
            <div>
              <Label>Date</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Du</Label>
                <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <Label>Au</Label>
                <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
          <Button onClick={() => {
            if (!name.trim() || !start) { toast.error("Nom et date requis"); return; }
            const date = dateType === "single" ? start : `${start}${end ? ` — ${end}` : ""}`;
            onSave({ id: `c_${Date.now()}`, name, date });
            reset();
          }}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

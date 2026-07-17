import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Video, Trash2, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { meetingsStore, useMeetings, generateMeetLink, type Meeting } from "@/lib/meetings-store";
import { useProspects } from "@/lib/prospects-store";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendrier — N7 Back Office" },
      { name: "description", content: "Planifiez et suivez les rendez-vous Google Meet avec vos prospects." },
    ],
  }),
  component: CalendarPage,
});

const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function startOfMonthGrid(y: number, m: number) {
  const first = new Date(y, m, 1);
  const dow = (first.getDay() + 6) % 7; // Monday=0
  return new Date(y, m, 1 - dow);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function CalendarPage() {
  const meetings = useMeetings();
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [creating, setCreating] = useState<Date | null>(null);

  const y = cursor.getFullYear();
  const m = cursor.getMonth();

  const days = useMemo(() => {
    const start = startOfMonthGrid(y, m);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [y, m]);

  const byDay = useMemo(() => {
    const map = new Map<string, Meeting[]>();
    for (const mt of meetings) {
      const d = new Date(mt.start);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(mt);
      arr.sort((a, b) => +new Date(a.start) - +new Date(b.start));
      map.set(key, arr);
    }
    return map;
  }, [meetings]);

  const today = new Date();
  const selectedList = selectedDay
    ? byDay.get(`${selectedDay.getFullYear()}-${selectedDay.getMonth()}-${selectedDay.getDate()}`) ?? []
    : [];

  return (
    <div>
      <PageHeader
        title="Calendrier"
        description="Rendez-vous Google Meet planifiés avec vos prospects."
        actions={
          <Button size="sm" onClick={() => setCreating(selectedDay ?? new Date())}>
            <Plus className="h-4 w-4 mr-1.5" /> Nouveau rendez-vous
          </Button>
        }
      />

      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(y, m - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(y, m + 1, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="ml-2 text-lg font-semibold">{MONTHS[m]} {y}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setCursor(new Date()); setSelectedDay(new Date()); }}>
              Aujourd'hui
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="bg-muted/60 text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
            {days.map((d) => {
              const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
              const items = byDay.get(key) ?? [];
              const inMonth = d.getMonth() === m;
              const isToday = sameDay(d, today);
              const isSelected = selectedDay && sameDay(d, selectedDay);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedDay(d)}
                  className={cn(
                    "bg-card min-h-[92px] p-1.5 text-left transition-colors relative",
                    !inMonth && "bg-muted/30 text-muted-foreground",
                    isSelected && "ring-2 ring-primary ring-inset",
                    "hover:bg-accent/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      isToday && "bg-primary text-primary-foreground",
                    )}>{d.getDate()}</span>
                    {items.length > 0 && (
                      <span className="text-[10px] text-muted-foreground">{items.length}</span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {items.slice(0, 2).map((mt) => (
                      <div
                        key={mt.id}
                        onClick={(e) => { e.stopPropagation(); setEditing(mt); }}
                        className="flex items-center gap-1 truncate rounded bg-primary/10 text-primary text-[11px] px-1.5 py-0.5 hover:bg-primary/20"
                      >
                        <Video className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {new Date(mt.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} {mt.clientName}
                        </span>
                      </div>
                    ))}
                    {items.length > 2 && (
                      <div className="text-[10px] text-muted-foreground pl-1">+{items.length - 2} autre(s)</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDay && (
        <Card className="mt-6 shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">Rendez-vous du</div>
                <div className="text-base font-semibold">
                  {selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setCreating(selectedDay)}>
                <Plus className="h-4 w-4 mr-1.5" /> Ajouter
              </Button>
            </div>
            {selectedList.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">Aucun rendez-vous ce jour.</div>
            ) : (
              <div className="space-y-2">
                {selectedList.map((mt) => (
                  <div key={mt.id} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/40">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Video className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{mt.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(mt.start).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} · {mt.durationMin} min · {mt.clientName}
                      </div>
                    </div>
                    <a href={mt.meetLink} target="_blank" rel="noreferrer">
                      <Button size="sm" variant="outline"><ExternalLink className="h-3.5 w-3.5 mr-1.5" />Rejoindre</Button>
                    </a>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(mt)}>Modifier</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <MeetingDialog
        meeting={editing}
        creatingFor={creating}
        onClose={() => { setEditing(null); setCreating(null); }}
      />
    </div>
  );
}

function MeetingDialog({
  meeting, creatingFor, onClose,
}: {
  meeting: Meeting | null;
  creatingFor: Date | null;
  onClose: () => void;
}) {
  const prospects = useProspects();
  const open = !!meeting || !!creatingFor;

  const initial: Meeting = meeting ?? {
    id: "",
    prospectId: undefined,
    title: "Rendez-vous découverte",
    clientName: "",
    clientEmail: "",
    start: (creatingFor ? new Date(creatingFor.getFullYear(), creatingFor.getMonth(), creatingFor.getDate(), 10, 0) : new Date()).toISOString(),
    durationMin: 30,
    meetLink: generateMeetLink(),
    notes: "",
  };

  const [d, setD] = useState<Meeting>(initial);
  // reset when opening
  useMemo(() => { setD(initial); /* eslint-disable-next-line */ }, [meeting?.id, creatingFor?.toISOString()]);

  const startDate = new Date(d.start);
  const dateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
  const timeStr = `${String(startDate.getHours()).padStart(2, "0")}:${String(startDate.getMinutes()).padStart(2, "0")}`;

  function updateDate(v: string) {
    const [Y, M, D] = v.split("-").map(Number);
    const nd = new Date(d.start);
    nd.setFullYear(Y, M - 1, D);
    setD({ ...d, start: nd.toISOString() });
  }
  function updateTime(v: string) {
    const [h, mi] = v.split(":").map(Number);
    const nd = new Date(d.start);
    nd.setHours(h, mi, 0, 0);
    setD({ ...d, start: nd.toISOString() });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meeting ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}</DialogTitle>
          <DialogDescription>Un lien Google Meet est généré automatiquement.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Titre</Label>
            <Input value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} />
          </div>
          <div>
            <Label>Prospect</Label>
            <Select
              value={d.prospectId ?? "none"}
              onValueChange={(v) => {
                if (v === "none") { setD({ ...d, prospectId: undefined }); return; }
                const p = prospects.find((x) => x.id === v);
                setD({ ...d, prospectId: v, clientName: p ? `${p.prenom} ${p.nom}` : d.clientName, clientEmail: p?.email ?? d.clientEmail });
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun (invité externe)</SelectItem>
                {prospects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.prenom} {p.nom} — {p.societe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nom du client</Label><Input value={d.clientName} onChange={(e) => setD({ ...d, clientName: e.target.value })} /></div>
            <div><Label>Email du client</Label><Input type="email" value={d.clientEmail} onChange={(e) => setD({ ...d, clientEmail: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Date</Label><Input type="date" value={dateStr} onChange={(e) => updateDate(e.target.value)} /></div>
            <div><Label>Heure</Label><Input type="time" value={timeStr} onChange={(e) => updateTime(e.target.value)} /></div>
            <div>
              <Label>Durée (min)</Label>
              <Input type="number" min={10} step={5} value={d.durationMin} onChange={(e) => setD({ ...d, durationMin: Number(e.target.value) || 30 })} />
            </div>
          </div>
          <div>
            <Label>Lien Google Meet</Label>
            <div className="flex gap-2">
              <Input value={d.meetLink} onChange={(e) => setD({ ...d, meetLink: e.target.value })} />
              <Button type="button" variant="outline" onClick={() => setD({ ...d, meetLink: generateMeetLink() })}>Régénérer</Button>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={3} value={d.notes ?? ""} onChange={(e) => setD({ ...d, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter className="gap-2">
          {meeting && (
            <Button variant="outline" className="text-destructive" onClick={() => {
              meetingsStore.remove(meeting.id);
              toast.success("Rendez-vous supprimé");
              onClose();
            }}>
              <Trash2 className="h-4 w-4 mr-1.5" />Supprimer
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={() => {
            if (!d.clientName.trim()) { toast.error("Nom du client requis"); return; }
            if (meeting) {
              meetingsStore.update(meeting.id, d);
              toast.success("Rendez-vous mis à jour");
            } else {
              meetingsStore.add(d);
              toast.success("Rendez-vous créé");
            }
            onClose();
          }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

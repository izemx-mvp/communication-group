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
    { id: "h1", name: "Eid al-Fitr", date: "2026-04-10" },
    { id: "h2", name: "Independence Day", date: "2026-11-18" },
  ]);
  const [closures, setClosures] = useState<Closure[]>([
    { id: "c1", name: "Summer break", date: "2026-08-01 — 2026-08-15" },
  ]);
  const [tz, setTz] = useState("africa-casablanca");
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [closureOpen, setClosureOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Opening hours</CardTitle>
            <p className="text-sm text-muted-foreground">Used by the AI to answer "are you open?" questions.</p>
          </div>
          <Button size="sm" onClick={() => toast.success("Hours saved")}>
            <Save className="h-4 w-4 mr-1.5" /> Save
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
                <Label className="text-sm text-muted-foreground">Closed</Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Public holidays</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <div className="font-medium">{h.name}</div>
                  <div className="text-xs text-muted-foreground">{h.date}</div>
                </div>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                  setHolidays((l) => l.filter((x) => x.id !== h.id));
                  toast.success("Holiday removed");
                }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setHolidayOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add holiday
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader><CardTitle className="text-base">Temporary closures & time zone</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Time zone</Label>
              <Select value={tz} onValueChange={(v) => { setTz(v); toast.success("Time zone updated"); }}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa-casablanca">Africa / Casablanca (GMT+1)</SelectItem>
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
                  toast.success("Closure removed");
                }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setClosureOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add closure
            </Button>
          </CardContent>
        </Card>
      </div>

      <ClosureDialog
        open={holidayOpen}
        title="Add public holiday"
        onClose={() => setHolidayOpen(false)}
        onSave={(c) => { setHolidays((l) => [...l, c]); toast.success("Holiday added"); setHolidayOpen(false); }}
        dateType="single"
      />
      <ClosureDialog
        open={closureOpen}
        title="Add temporary closure"
        onClose={() => setClosureOpen(false)}
        onSave={(c) => { setClosures((l) => [...l, c]); toast.success("Closure added"); setClosureOpen(false); }}
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
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Christmas Day" />
          </div>
          {dateType === "single" ? (
            <div>
              <Label>Date</Label>
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>From</Label>
                <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <Label>To</Label>
                <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button onClick={() => {
            if (!name.trim() || !start) { toast.error("Name and date required"); return; }
            const date = dateType === "single" ? start : `${start}${end ? ` — ${end}` : ""}`;
            onSave({ id: `c_${Date.now()}`, name, date });
            reset();
          }}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/app-shell";
import { services as seed, type Service } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/services")({
  component: ServicesPage,
});

const empty: Service = { id: "", name: "", description: "", price: "", status: "Draft" };

function ServicesPage() {
  const [list, setList] = useState<Service[]>(seed);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function save(s: Service) {
    if (!s.name.trim()) { toast.error("Name is required"); return; }
    if (s.id) {
      setList((l) => l.map((x) => (x.id === s.id ? s : x)));
      toast.success("Service updated");
    } else {
      setList((l) => [{ ...s, id: `s_${Date.now()}` }, ...l]);
      toast.success("Service created");
    }
    setEditing(null);
  }
  function remove() {
    if (!deleteId) return;
    setList((l) => l.filter((x) => x.id !== deleteId));
    toast.success("Service deleted");
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-1.5" /> New service</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {list.map((s) => (
          <Card key={s.id} className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  {s.price && <div className="text-sm text-primary font-medium mt-0.5">{s.price}</div>}
                </div>
                <StatusBadge status={s.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
              <div className="mt-4 flex gap-1 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setEditing(s)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ServiceDialog svc={editing} onClose={() => setEditing(null)} onSave={save} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>The AI will stop offering it.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ServiceDialog({ svc, onClose, onSave }: { svc: Service | null; onClose: () => void; onSave: (s: Service) => void }) {
  const [d, setD] = useState<Service>(svc ?? empty);
  if (svc && d.id !== svc.id) setD(svc);

  return (
    <Dialog open={!!svc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader><DialogTitle>{svc?.id ? "Edit service" : "New service"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={4} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price (optional)</Label>
              <Input value={d.price ?? ""} onChange={(e) => setD({ ...d, price: e.target.value })} placeholder="e.g. From €499/mo" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={d.status} onValueChange={(v: "Draft" | "Published") => setD({ ...d, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(d)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

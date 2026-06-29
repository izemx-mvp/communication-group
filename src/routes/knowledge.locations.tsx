import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MapPin, Mail, Phone, ExternalLink, Edit, Trash2 } from "lucide-react";
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
import { locations as seed, type Location } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/locations")({
  component: LocationsPage,
});

const empty: Location = {
  id: "", name: "", address: "", city: "", country: "",
  mapsUrl: "https://maps.google.com", phone: "", email: "", notes: "",
};

function LocationsPage() {
  const [list, setList] = useState<Location[]>(seed);
  const [editing, setEditing] = useState<Location | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function save(l: Location) {
    if (!l.name.trim() || !l.address.trim()) { toast.error("Name and address are required"); return; }
    if (l.id) {
      setList((arr) => arr.map((x) => (x.id === l.id ? l : x)));
      toast.success("Location updated");
    } else {
      setList((arr) => [{ ...l, id: `l_${Date.now()}` }, ...arr]);
      toast.success("Location created");
    }
    setEditing(null);
  }
  function remove() {
    if (!deleteId) return;
    setList((arr) => arr.filter((x) => x.id !== deleteId));
    toast.success("Location deleted");
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-1.5" /> New location</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((l) => (
          <Card key={l.id} className="shadow-soft overflow-hidden hover:shadow-elevated transition-shadow">
            <div className="h-32 bg-gradient-to-br from-primary/20 via-accent to-muted relative">
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-sm text-muted-foreground">{l.address}</div>
                  <div className="text-sm text-muted-foreground">{l.city}, {l.country}</div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(l)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(l.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <div className="grid gap-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" /> {l.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" /> {l.email}</div>
              </div>
              {l.notes && <p className="text-xs text-muted-foreground bg-muted/40 rounded-md p-2">{l.notes}</p>}
              <Button asChild variant="outline" size="sm" className="w-full">
                <a href={l.mapsUrl} target="_blank" rel="noreferrer">Open in Maps <ExternalLink className="h-3.5 w-3.5 ml-1.5" /></a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <LocationDialog loc={editing} onClose={() => setEditing(null)} onSave={save} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this location?</AlertDialogTitle>
            <AlertDialogDescription>It will no longer be shared by the AI Customer Service Agent.</AlertDialogDescription>
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

function LocationDialog({ loc, onClose, onSave }: { loc: Location | null; onClose: () => void; onSave: (l: Location) => void }) {
  const [d, setD] = useState<Location>(loc ?? empty);
  if (loc && d.id !== loc.id) setD(loc);

  return (
    <Dialog open={!!loc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader><DialogTitle>{loc?.id ? "Edit location" : "New location"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="e.g. N7 Headquarters" />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={d.address} onChange={(e) => setD({ ...d, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>City</Label>
              <Input value={d.city} onChange={(e) => setD({ ...d, city: e.target.value })} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={d.country} onChange={(e) => setD({ ...d, country: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Maps URL</Label>
            <Input value={d.mapsUrl} onChange={(e) => setD({ ...d, mapsUrl: e.target.value })} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={2} value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} />
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

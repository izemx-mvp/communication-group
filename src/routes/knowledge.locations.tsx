import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Mail, Phone, ExternalLink, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { locations } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/locations")({
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => toast.success("New location")}><Plus className="h-4 w-4 mr-1.5" /> New location</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {locations.map((l) => (
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
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Editing")}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Deleted")}><Trash2 className="h-3.5 w-3.5" /></Button>
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
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app-shell";
import { services } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/services")({
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => toast.success("New service")}><Plus className="h-4 w-4 mr-1.5" /> New service</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s) => (
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
                <Button size="sm" variant="ghost" onClick={() => toast.success("Editing")}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Deleted")}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

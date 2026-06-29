import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessHours } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/business-hours")({
  component: BusinessHoursPage,
});

function BusinessHoursPage() {
  const [hours, setHours] = useState(businessHours);

  return (
    <div className="space-y-6">
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Opening hours</CardTitle>
            <p className="text-sm text-muted-foreground">Used by the AI to answer "are you open?" questions.</p>
          </div>
          <Button size="sm" onClick={() => toast.success("Saved")}>
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
          <CardHeader>
            <CardTitle className="text-base">Public holidays</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
              <div>
                <div className="font-medium">Eid al-Fitr</div>
                <div className="text-xs text-muted-foreground">April 10, 2026</div>
              </div>
              <span className="text-xs font-medium text-destructive">Closed</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
              <div>
                <div className="font-medium">Independence Day</div>
                <div className="text-xs text-muted-foreground">November 18, 2026</div>
              </div>
              <span className="text-xs font-medium text-destructive">Closed</span>
            </div>
            <Button variant="outline" size="sm" className="w-full"><Plus className="h-4 w-4 mr-1.5" /> Add holiday</Button>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Temporary closures & time zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Time zone</Label>
              <Select defaultValue="africa-casablanca">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa-casablanca">Africa / Casablanca (GMT+1)</SelectItem>
                  <SelectItem value="europe-paris">Europe / Paris (GMT+1)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 rounded-lg bg-muted/40">
              <div className="font-medium text-sm">Summer break</div>
              <div className="text-xs text-muted-foreground mt-0.5">Aug 1 — Aug 15, 2026</div>
            </div>
            <Button variant="outline" size="sm" className="w-full"><Plus className="h-4 w-4 mr-1.5" /> Add closure</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

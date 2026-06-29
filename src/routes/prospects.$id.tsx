import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Edit, UserCheck, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { prospects } from "@/lib/mock-data";

export const Route = createFileRoute("/prospects/$id")({
  head: () => ({
    meta: [{ title: "Prospect detail — N7 Back Office" }],
  }),
  component: ProspectDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">Prospect not found.</div>
  ),
});

function ProspectDetail() {
  const { id } = useParams({ from: "/prospects/$id" });
  const p = prospects.find((x) => x.id === id);

  if (!p) {
    return <div className="p-8 text-center text-muted-foreground">Prospect not found.</div>;
  }

  const initials = `${p.prenom[0]}${p.nom[0]}`;

  return (
    <div>
      <Link to="/prospects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to prospects
      </Link>

      <PageHeader
        title={`${p.prenom} ${p.nom}`}
        description={p.societe}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Edit drawer opened")}>
              <Edit className="h-4 w-4 mr-1.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Assignment updated")}>
              <UserCheck className="h-4 w-4 mr-1.5" /> Assign
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => toast.error("Prospect deleted")}>
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="text-lg">{p.prenom} {p.nom}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-1">
                  <StatusBadge status={p.status} />
                  <StatusBadge status={p.score} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <InfoRow icon={Building2} label="Société" value={p.societe} />
                <InfoRow icon={Mail} label="Email" value={p.email} />
                <InfoRow icon={Phone} label="Téléphone" value={p.telephone} />
                <InfoRow icon={MapPin} label="Localisation" value={`${p.ville}, ${p.pays}`} />
                <InfoRow icon={Calendar} label="Reçu le" value={new Date(p.date).toLocaleString()} />
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Message</div>
                <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-3">{p.message}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Internal notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea defaultValue={p.notes} placeholder="Add a private note for your team…" rows={4} />
              <div className="flex justify-end mt-3">
                <Button size="sm" onClick={() => toast.success("Note saved")}>Save note</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Internal information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <KV k="Lead Score" v={<StatusBadge status={p.score} />} />
              <KV k="Status" v={<StatusBadge status={p.status} />} />
              <KV k="Source" v={p.source} />
              <KV k="Assigned to" v={p.assignedTo} />
              <KV k="Created at" v={new Date(p.date).toLocaleDateString()} />
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-to-br from-accent to-card">
            <CardContent className="p-5">
              <div className="text-sm font-semibold">AI suggestion</div>
              <p className="text-sm text-muted-foreground mt-1">
                This prospect is marked <strong>{p.score}</strong>. Consider a personalized follow-up within 24 hours to maintain momentum.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

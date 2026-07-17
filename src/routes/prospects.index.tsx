import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search, Plus } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  type LeadStatus, type LeadSource, type LeadScore, type Prospect,
  statusLabel, sourceLabel, scoreLabel,
} from "@/lib/mock-data";
import { prospectsStore, useProspects } from "@/lib/prospects-store";

export const Route = createFileRoute("/prospects/")({
  head: () => ({
    meta: [
      { title: "Prospects — N7 Back Office" },
      { name: "description", content: "Liste CRM de chaque formulaire de contact soumis." },
    ],
  }),
  component: ProspectsList,
});

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Won", "Lost"];
const sources: LeadSource[] = ["Website", "WhatsApp", "Facebook", "Instagram", "LinkedIn"];
const scores: LeadScore[] = ["Cold", "Warm", "Hot"];
const team = ["Yassine A.", "Fatima Z.", "Hicham B.", "Non assigné"];


function ProspectsList() {
  const data = useProspects();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => data.filter((p) => {
    const s = q.toLowerCase().trim();
    if (s && !`${p.prenom} ${p.nom} ${p.societe} ${p.email} ${p.ville}`.toLowerCase().includes(s)) return false;
    if (status !== "all" && p.status !== status) return false;
    if (source !== "all" && p.source !== source) return false;
    return true;
  }), [data, q, status, source]);

  function exportCsv() {
    const headers = ["nom", "prenom", "societe", "email", "telephone", "pays", "ville", "source", "score", "status", "date"];
    const rows = filtered.map((p) => headers.map((h) => JSON.stringify(String((p as any)[h] ?? ""))).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `prospects-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length} prospect(s) exporté(s)`);
  }

  return (
    <div>
      <PageHeader
        title="Qualification AI"
        description={`${filtered.length} sur ${data.length} prospects qualifiés par l'IA`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="h-4 w-4 mr-1.5" /> Exporter
            </Button>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Nouveau prospect
            </Button>
          </>
        }
      />

      <Card className="shadow-soft">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par nom, email, société…" className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statuses.map((s) => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                {sources.map((s) => <SelectItem key={s} value={s}>{sourceLabel[s]}</SelectItem>)}
              </SelectContent>
            </Select>

          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Société</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                  <TableHead className="hidden lg:table-cell">Pays</TableHead>
                  <TableHead className="hidden xl:table-cell">Ville</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                      Aucun prospect ne correspond à vos filtres.
                    </TableCell>
                  </TableRow>
                ) : filtered.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40" onClick={() => navigate({ to: "/prospects/$id", params: { id: p.id } })}>
                    <TableCell className="font-medium">
                      <Link to="/prospects/$id" params={{ id: p.id }} className="hover:text-primary" onClick={(e) => e.stopPropagation()}>
                        {p.nom}
                      </Link>
                    </TableCell>
                    <TableCell>{p.prenom}</TableCell>
                    <TableCell className="text-muted-foreground">{p.societe}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{p.telephone}</TableCell>
                    <TableCell className="hidden lg:table-cell">{p.pays}</TableCell>
                    <TableCell className="hidden xl:table-cell">{p.ville}</TableCell>
                    <TableCell>{sourceLabel[p.source] ?? p.source}</TableCell>
                    <TableCell><StatusBadge status={scoreLabel[p.score] ?? p.score} /></TableCell>
                    <TableCell><StatusBadge status={statusLabel[p.status] ?? p.status} /></TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {new Date(p.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
        </CardContent>
      </Card>

      <NewProspectDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function NewProspectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const empty: Omit<Prospect, "id" | "date"> = {
    nom: "", prenom: "", societe: "", email: "", telephone: "",
    pays: "Maroc", ville: "Casablanca", source: "Website",
    score: "Warm", status: "New", message: "", assignedTo: "Non assigné", notes: "",
  };
  const [d, setD] = useState(empty);

  function reset() { setD(empty); }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Nouveau prospect</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Prénom</Label><Input value={d.prenom} onChange={(e) => setD({ ...d, prenom: e.target.value })} /></div>
            <div><Label>Nom</Label><Input value={d.nom} onChange={(e) => setD({ ...d, nom: e.target.value })} /></div>
          </div>
          <div><Label>Société</Label><Input value={d.societe} onChange={(e) => setD({ ...d, societe: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Email</Label><Input type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></div>
            <div><Label>Téléphone</Label><Input value={d.telephone} onChange={(e) => setD({ ...d, telephone: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Pays</Label><Input value={d.pays} onChange={(e) => setD({ ...d, pays: e.target.value })} /></div>
            <div><Label>Ville</Label><Input value={d.ville} onChange={(e) => setD({ ...d, ville: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Source</Label>
              <Select value={d.source} onValueChange={(v: LeadSource) => setD({ ...d, source: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{sources.map((s) => <SelectItem key={s} value={s}>{sourceLabel[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Score</Label>
              <Select value={d.score} onValueChange={(v: LeadScore) => setD({ ...d, score: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{scores.map((s) => <SelectItem key={s} value={s}>{scoreLabel[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={d.status} onValueChange={(v: LeadStatus) => setD({ ...d, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{statusLabel[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Assigné à</Label>
            <Select value={d.assignedTo} onValueChange={(v) => setD({ ...d, assignedTo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{team.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Message</Label><Textarea rows={3} value={d.message} onChange={(e) => setD({ ...d, message: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Annuler</Button>
          <Button onClick={() => {
            if (!d.nom || !d.prenom || !d.email) { toast.error("Nom et email requis"); return; }
            prospectsStore.add(d);
            toast.success("Prospect ajouté");
            reset();
            onClose();
          }}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


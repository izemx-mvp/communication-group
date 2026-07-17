import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Mail, Phone, MapPin, Building2, Edit, UserCheck, Trash2, Calendar,
  Video, ExternalLink, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { meetingsStore, useMeetings, generateMeetLink, type Meeting } from "@/lib/meetings-store";

import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import {
  type LeadScore, type LeadSource, type LeadStatus, type Prospect,
  statusLabel, scoreLabel, sourceLabel,
} from "@/lib/mock-data";
import { prospectsStore, useProspects } from "@/lib/prospects-store";

export const Route = createFileRoute("/prospects/$id")({
  head: () => ({ meta: [{ title: "Détail du prospect — N7 Back Office" }] }),
  component: ProspectDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center text-muted-foreground">Prospect introuvable.</div>
  ),
});

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Won", "Lost"];
const sources: LeadSource[] = ["Website", "WhatsApp", "Facebook", "Instagram", "LinkedIn"];
const scores: LeadScore[] = ["Cold", "Warm", "Hot"];
const team = ["Yassine A.", "Fatima Z.", "Hicham B.", "Non assigné"];


function ProspectDetail() {
  const { id } = useParams({ from: "/prospects/$id" });
  const navigate = useNavigate();
  const list = useProspects();
  const p = list.find((x) => x.id === id);

  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [note, setNote] = useState(p?.notes ?? "");

  if (!p) return <div className="p-8 text-center text-muted-foreground">Prospect introuvable.</div>;
  const initials = `${p.prenom[0]}${p.nom[0]}`;

  return (
    <div>
      <Link to="/prospects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Retour aux prospects
      </Link>

      <PageHeader
        title={`${p.prenom} ${p.nom}`}
        description={p.societe}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Edit className="h-4 w-4 mr-1.5" /> Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAssignOpen(true)}>
              <UserCheck className="h-4 w-4 mr-1.5" /> Assigner
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-1.5" /> Supprimer
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
                  <StatusBadge status={statusLabel[p.status] ?? p.status} />
                  <StatusBadge status={scoreLabel[p.score] ?? p.score} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <InfoRow icon={Building2} label="Société" value={p.societe} />
                <InfoRow icon={Mail} label="Email" value={p.email} />
                <InfoRow icon={Phone} label="Téléphone" value={p.telephone} />
                <InfoRow icon={MapPin} label="Localisation" value={`${p.ville}, ${p.pays}`} />
                <InfoRow icon={Calendar} label="Reçu le" value={new Date(p.date).toLocaleString("fr-FR")} />
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1.5">Message</div>
                <p className="text-sm text-muted-foreground bg-muted/40 rounded-md p-3">{p.message}</p>
              </div>
            </CardContent>
          </Card>

          <ProspectMeetings prospectId={p.id} prospectName={`${p.prenom} ${p.nom}`} prospectEmail={p.email} />

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Notes internes</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note privée pour votre équipe…" rows={4} />
              <div className="flex justify-end mt-3">
                <Button size="sm" onClick={() => {
                  prospectsStore.update(p.id, { notes: note });
                  toast.success("Note enregistrée");
                }}>Enregistrer la note</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Informations internes</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <KV k="Score" v={<StatusBadge status={scoreLabel[p.score] ?? p.score} />} />
              <KV k="Statut" v={<StatusBadge status={statusLabel[p.status] ?? p.status} />} />
              <KV k="Source" v={sourceLabel[p.source] ?? p.source} />
              <KV k="Assigné à" v={p.assignedTo} />
              <KV k="Créé le" v={new Date(p.date).toLocaleDateString("fr-FR")} />
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-to-br from-accent to-card">
            <CardContent className="p-5">
              <div className="text-sm font-semibold">Suggestion de l'IA</div>
              <p className="text-sm text-muted-foreground mt-1">
                Ce prospect est marqué <strong>{scoreLabel[p.score] ?? p.score}</strong>. Pensez à un suivi personnalisé sous 24 heures pour maintenir l'élan.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>

      <EditDialog open={editOpen} onClose={() => setEditOpen(false)} prospect={p} />
      <AssignDialog open={assignOpen} onClose={() => setAssignOpen(false)} prospect={p} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce prospect ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              prospectsStore.remove(p.id);
              toast.success("Prospect supprimé");
              navigate({ to: "/prospects" });
            }}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

function EditDialog({ open, onClose, prospect }: { open: boolean; onClose: () => void; prospect: Prospect }) {
  const [d, setD] = useState(prospect);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Modifier le prospect</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Prénom</Label><Input value={d.prenom} onChange={(e) => setD({ ...d, prenom: e.target.value })} /></div>
            <div><Label>Nom</Label><Input value={d.nom} onChange={(e) => setD({ ...d, nom: e.target.value })} /></div>
          </div>
          <div><Label>Société</Label><Input value={d.societe} onChange={(e) => setD({ ...d, societe: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Email</Label><Input value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></div>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={() => {
            prospectsStore.update(d.id, d);
            toast.success("Prospect mis à jour");
            onClose();
          }}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssignDialog({ open, onClose, prospect }: { open: boolean; onClose: () => void; prospect: Prospect }) {
  const [who, setWho] = useState(prospect.assignedTo);
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader><DialogTitle>Assigner le prospect</DialogTitle></DialogHeader>
        <div>
          <Label>Membre de l'équipe</Label>
          <Select value={who} onValueChange={setWho}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{team.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={() => {
            prospectsStore.update(prospect.id, { assignedTo: who });
            toast.success(`Assigné à ${who}`);
            onClose();
          }}>Assigner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, UserCog, Mail } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/app-shell";
import { Checkbox } from "@/components/ui/checkbox";
import { usersStore, useUsers, MODULES, type AppUser, type UserRole, type UserStatus, type ModuleKey } from "@/lib/users-store";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [{ title: "Gestion des utilisateurs — N7 Back Office" }],
  }),
  component: UsersPage,
});

const roles: UserRole[] = ["Admin", "Manager", "Agent", "Lecteur"];
const statuses: UserStatus[] = ["Actif", "Invité", "Suspendu"];

const emptyDraft: Omit<AppUser, "id" | "createdAt"> = {
  name: "", email: "", role: "Agent", status: "Invité", modules: ["dashboard"],
};

function UsersPage() {
  const users = useUsers();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [draft, setDraft] = useState({ ...emptyDraft });

  const filtered = useMemo(() => users.filter((u) => {
    const s = q.toLowerCase().trim();
    if (s && !`${u.name} ${u.email}`.toLowerCase().includes(s)) return false;
    if (role !== "all" && u.role !== role) return false;
    return true;
  }), [users, q, role]);

  function openNew() {
    setEditing(null);
    setDraft({ ...emptyDraft });
    setOpen(true);
  }
  function openEdit(u: AppUser) {
    setEditing(u);
    setDraft({ name: u.name, email: u.email, role: u.role, status: u.status, modules: u.modules ?? [] });
    setOpen(true);
  }
  function save() {
    if (!draft.name.trim() || !draft.email.trim()) {
      toast.error("Nom et email requis");
      return;
    }
    if (editing) {
      usersStore.update(editing.id, draft);
      toast.success("Utilisateur mis à jour");
    } else {
      usersStore.add(draft);
      toast.success("Utilisateur ajouté");
    }
    setOpen(false);
  }
  function remove(u: AppUser) {
    usersStore.remove(u.id);
    toast.success(`${u.name} supprimé`);
  }

  return (
    <div>
      <PageHeader
        title="Gestion des utilisateurs"
        description="Créez, modifiez et gérez les accès de votre équipe au back office."
      />
      <Card className="shadow-soft">
        <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un utilisateur…" className="pl-9" />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Rôle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" /> Nouvel utilisateur
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Utilisateur</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden xl:table-cell">Modules</TableHead>
                <TableHead className="hidden lg:table-cell">Créé le</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id} className="hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {u.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{u.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      <UserCog className="h-3 w-3 mr-1" /> {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        u.status === "Actif" && "bg-success/15 text-success border-success/20",
                        u.status === "Invité" && "bg-info/15 text-info border-info/20",
                        u.status === "Suspendu" && "bg-destructive/10 text-destructive border-destructive/20",
                      )}
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{u.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toast.info(`Invitation renvoyée à ${u.email}`)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(u)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Nom complet</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ex. Sofia Idrissi" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="prenom@n7group.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Rôle</Label>
                <Select value={draft.role} onValueChange={(v) => setDraft({ ...draft, role: v as UserRole })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Statut</Label>
                <Select value={draft.status} onValueChange={(v) => setDraft({ ...draft, status: v as UserStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Accès aux modules</Label>
              <div className="rounded-lg border border-border p-3 grid grid-cols-2 gap-2">
                {MODULES.map((m) => {
                  const checked = draft.modules.includes(m.key);
                  return (
                    <label key={m.key} className="flex items-center gap-2 text-sm cursor-pointer rounded-md px-2 py-1.5 hover:bg-muted">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const next = v
                            ? [...draft.modules, m.key]
                            : draft.modules.filter((k) => k !== m.key);
                          setDraft({ ...draft, modules: next as ModuleKey[] });
                        }}
                      />
                      <span>{m.label}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">Contrôle les sections visibles pour cet utilisateur dans la barre latérale.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={save}>{editing ? "Enregistrer" : "Créer"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </Card>
    </div>
  );
}

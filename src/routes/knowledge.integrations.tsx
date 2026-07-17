import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plug, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  integrationDefs, integrationsStore, useIntegrations,
  type IntegrationDef,
} from "@/lib/integrations-store";

export const Route = createFileRoute("/knowledge/integrations")({
  head: () => ({ meta: [{ title: "Intégrations — N7 Back Office" }] }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const state = useIntegrations();
  const [editing, setEditing] = useState<{ def: IntegrationDef; mode: "connect" | "modify" } | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Connectez vos outils pour alimenter l'Agent IA et automatiser vos flux (messages, réunions, CRM…).
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrationDefs.map((def) => {
          const st = state[def.id] ?? { connected: false, active: false };
          return (
            <Card key={def.id} className="shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-lg bg-muted grid place-items-center overflow-hidden shrink-0">
                    <img src={def.logo} alt={def.name} className="h-8 w-8 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">{def.name}</div>
                      {st.connected && (
                        <Badge variant="outline" className="text-success border-success/30 bg-success/10">
                          <Check className="h-3 w-3 mr-1" />Connecté
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] uppercase tracking-wide text-muted-foreground mt-0.5">{def.category}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 flex-1">{def.description}</p>

                {st.connected ? (
                  <>
                    <div className="mt-3 text-xs text-muted-foreground truncate">
                      Compte : <span className="font-medium text-foreground">{st.account}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <Switch
                          checked={st.active}
                          onCheckedChange={(v) => {
                            integrationsStore.toggle(def.id, v);
                            toast.success(v ? `${def.name} activé` : `${def.name} désactivé`);
                          }}
                        />
                        <span className={st.active ? "text-foreground" : "text-muted-foreground"}>
                          {st.active ? "Actif" : "Inactif"}
                        </span>
                      </label>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => setEditing({ def, mode: "modify" })}>
                          <Settings2 className="h-3.5 w-3.5 mr-1.5" />Modifier
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => {
                          integrationsStore.disconnect(def.id);
                          toast.success(`${def.name} déconnecté`);
                        }}>Déconnecter</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <Button className="w-full" onClick={() => setEditing({ def, mode: "connect" })}>
                      <Plug className="h-4 w-4 mr-1.5" />Connecter
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {editing && (
        <ConnectDialog
          def={editing.def}
          mode={editing.mode}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function ConnectDialog({
  def, mode, onClose,
}: { def: IntegrationDef; mode: "connect" | "modify"; onClose: () => void }) {
  const existing = integrationsStore.get(def.id).values ?? {};
  const [values, setValues] = useState<Record<string, string>>(
    mode === "modify" ? { ...existing } : Object.fromEntries(def.fields.map((f) => [f.key, ""])),
  );

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center overflow-hidden">
              <img src={def.logo} alt={def.name} className="h-7 w-7 object-contain" />
            </div>
            <div>
              <DialogTitle>{mode === "modify" ? `Modifier ${def.name}` : `Connecter ${def.name}`}</DialogTitle>
              <DialogDescription>
                {mode === "modify"
                  ? "Remplacez les identifiants du compte actuellement lié."
                  : "Renseignez les identifiants API fournis par le service."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3">
          {def.fields.map((f) => (
            <div key={f.key}>
              <Label>{f.label}</Label>
              <Input
                type={f.type === "password" ? "password" : f.type === "email" ? "email" : f.type === "url" ? "url" : "text"}
                value={values[f.key] ?? ""}
                placeholder={f.placeholder}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
              {f.help && <div className="text-xs text-muted-foreground mt-1">{f.help}</div>}
            </div>
          ))}
          {def.docsUrl && (
            <a href={def.docsUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
              Documentation officielle →
            </a>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={() => {
            const missing = def.fields.find((f) => !values[f.key]?.trim());
            if (missing) { toast.error(`Champ requis : ${missing.label}`); return; }
            integrationsStore.connect(def.id, values);
            toast.success(mode === "modify" ? `${def.name} mis à jour` : `${def.name} connecté`);
            onClose();
          }}>{mode === "modify" ? "Enregistrer" : "Connecter"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

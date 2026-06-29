import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
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
import { faqs as seed, type Faq } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/faq")({
  component: FaqPage,
});

const empty: Faq = { id: "", question: "", answer: "", category: "Produit", status: "Draft" };

function FaqPage() {
  const [list, setList] = useState<Faq[]>(seed);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function save(f: Faq) {
    if (!f.question.trim() || !f.answer.trim()) { toast.error("Question et réponse requises"); return; }
    if (f.id) {
      setList((l) => l.map((x) => (x.id === f.id ? f : x)));
      toast.success("FAQ mise à jour");
    } else {
      setList((l) => [{ ...f, id: `f_${Date.now()}` }, ...l]);
      toast.success("FAQ créée");
    }
    setEditing(null);
  }
  function remove() {
    if (!deleteId) return;
    setList((l) => l.filter((x) => x.id !== deleteId));
    toast.success("FAQ supprimée");
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing({ ...empty })}>
          <Plus className="h-4 w-4 mr-1.5" /> Nouvelle question
        </Button>
      </div>
      <Card className="shadow-soft p-2">
        <Accordion type="single" collapsible className="w-full">
          {list.map((f) => (
            <AccordionItem key={f.id} value={f.id} className="border-b last:border-0 px-3">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span className="font-medium">{f.question}</span>
                  <StatusBadge status={f.status === "Published" ? "Publié" : "Brouillon"} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{f.answer}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-primary font-medium">{f.category}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditing(f)}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(f.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <FaqDialog faq={editing} onClose={() => setEditing(null)} onSave={save} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette question ?</AlertDialogTitle>
            <AlertDialogDescription>L'IA cessera d'utiliser cette réponse.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FaqDialog({ faq, onClose, onSave }: { faq: Faq | null; onClose: () => void; onSave: (f: Faq) => void }) {
  const [d, setD] = useState<Faq>(faq ?? empty);
  if (faq && d.id !== faq.id) setD(faq);

  return (
    <Dialog open={!!faq} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader><DialogTitle>{faq?.id ? "Modifier la question" : "Nouvelle question"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Question</Label>
            <Input value={d.question} onChange={(e) => setD({ ...d, question: e.target.value })} />
          </div>
          <div>
            <Label>Réponse</Label>
            <Textarea rows={5} value={d.answer} onChange={(e) => setD({ ...d, answer: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Catégorie</Label>
              <Input value={d.category} onChange={(e) => setD({ ...d, category: e.target.value })} />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={d.status} onValueChange={(v: "Draft" | "Published") => setD({ ...d, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Brouillon</SelectItem>
                  <SelectItem value="Published">Publié</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={() => onSave(d)}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/app-shell";
import { articles as seed, type Article } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/")({
  component: ArticlesPage,
});

const empty: Article = {
  id: "", title: "", category: "Onboarding", content: "", tags: [],
  status: "Draft", updatedAt: new Date().toISOString().slice(0, 10),
};

function ArticlesPage() {
  const [list, setList] = useState<Article[]>(seed);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Article | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = list.filter((a) =>
    `${a.title} ${a.category} ${a.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())
  );

  function save(a: Article) {
    if (!a.title.trim()) { toast.error("Title is required"); return; }
    const today = new Date().toISOString().slice(0, 10);
    if (a.id) {
      setList((l) => l.map((x) => (x.id === a.id ? { ...a, updatedAt: today } : x)));
      toast.success("Article updated");
    } else {
      setList((l) => [{ ...a, id: `a_${Date.now()}`, updatedAt: today }, ...l]);
      toast.success("Article created");
    }
    setEditing(null);
  }
  function remove() {
    if (!deleteId) return;
    setList((l) => l.filter((x) => x.id !== deleteId));
    toast.success("Article deleted");
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="pl-9" />
        </div>
        <Button onClick={() => setEditing({ ...empty })}>
          <Plus className="h-4 w-4 mr-1.5" /> New article
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <Card key={a.id} className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-primary font-medium uppercase tracking-wide">{a.category}</div>
                  <div className="font-semibold text-base mt-1">{a.title}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.content}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Updated {a.updatedAt}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(a)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">No articles found.</div>
        )}
      </div>

      <ArticleDialog article={editing} onClose={() => setEditing(null)} onSave={save} />

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              The AI will immediately stop using it. This action cannot be undone.
            </AlertDialogDescription>
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

function ArticleDialog({
  article, onClose, onSave,
}: { article: Article | null; onClose: () => void; onSave: (a: Article) => void }) {
  const [draft, setDraft] = useState<Article>(article ?? empty);
  // re-sync when opened with a different article
  if (article && draft.id !== article.id) setDraft(article);

  return (
    <Dialog open={!!article} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{article?.id ? "Edit article" : "New article"}</DialogTitle>
          <DialogDescription>Published articles are used by the AI Customer Service Agent.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. How to reset my password" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={draft.status} onValueChange={(v: "Draft" | "Published") => setDraft({ ...draft, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Content</Label>
            <Textarea rows={6} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="Write the article body…" />
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={draft.tags.join(", ")}
              onChange={(e) => setDraft({ ...draft, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(draft)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

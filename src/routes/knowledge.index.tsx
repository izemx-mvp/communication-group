import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/app-shell";
import { articles } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/")({
  component: ArticlesPage,
});

function ArticlesPage() {
  const [q, setQ] = useState("");
  const filtered = articles.filter((a) =>
    `${a.title} ${a.category} ${a.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="pl-9" />
        </div>
        <Button onClick={() => toast.success("New article")}>
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
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Editing")}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Deleted")}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Search, FileText, Trash2, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/app-shell";
import { documents } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/documents")({
  component: DocumentsPage,
});

function DocumentsPage() {
  const [q, setQ] = useState("");
  const [drag, setDrag] = useState(false);
  const filtered = documents.filter((d) =>
    `${d.title} ${d.category}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); toast.success("File uploaded"); }}
        className={`rounded-xl border-2 border-dashed transition p-8 text-center ${
          drag ? "border-primary bg-primary/5" : "border-border bg-muted/30"
        }`}
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary mb-3">
          <Upload className="h-5 w-5" />
        </div>
        <div className="font-medium">Drop files here or click to upload</div>
        <div className="text-sm text-muted-foreground mt-1">
          PDF, DOCX, XLSX, PPTX, CSV, TXT — up to 25MB
        </div>
        <Button className="mt-4" onClick={() => toast.success("File picker")}>Browse files</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className="pl-9" />
        </div>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{d.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{d.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell><span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">{d.format}</span></TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{d.size}</TableCell>
                    <TableCell><StatusBadge status={d.status} /></TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{d.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => toast.success("Preview")}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success("File replaced")}><RefreshCw className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Deleted")}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

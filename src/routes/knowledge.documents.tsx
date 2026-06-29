import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, Search, FileText, Trash2, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/app-shell";
import { documents as seed, type DocItem } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/documents")({
  component: DocumentsPage,
});

const extFormat: Record<string, DocItem["format"]> = {
  pdf: "PDF", docx: "DOCX", doc: "DOCX", xlsx: "XLSX", xls: "XLSX",
  pptx: "PPTX", ppt: "PPTX", csv: "CSV", txt: "TXT",
};

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function DocumentsPage() {
  const [list, setList] = useState<DocItem[]>(seed);
  const [q, setQ] = useState("");
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState<DocItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [replaceId, setReplaceId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);

  const filtered = list.filter((d) =>
    `${d.title} ${d.category}`.toLowerCase().includes(q.toLowerCase())
  );

  function addFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const today = new Date().toISOString().slice(0, 10);
    const items: DocItem[] = Array.from(files).map((f, i) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      return {
        id: `d_${Date.now()}_${i}`,
        title: f.name.replace(/\.[^.]+$/, ""),
        category: "Uncategorized",
        description: "Uploaded document",
        format: extFormat[ext] ?? "PDF",
        size: humanSize(f.size),
        status: "Draft",
        uploadedAt: today,
        updatedAt: today,
      };
    });
    setList((l) => [...items, ...l]);
    toast.success(`${items.length} document(s) uploaded`);
  }

  function replace(files: FileList | null) {
    if (!files || !files.length || !replaceId) return;
    const f = files[0];
    const today = new Date().toISOString().slice(0, 10);
    setList((l) => l.map((d) => d.id === replaceId
      ? { ...d, size: humanSize(f.size), updatedAt: today }
      : d
    ));
    toast.success("Document replaced");
    setReplaceId(null);
    if (replaceRef.current) replaceRef.current.value = "";
  }

  function remove() {
    if (!deleteId) return;
    setList((l) => l.filter((d) => d.id !== deleteId));
    toast.success("Document deleted");
    setDeleteId(null);
  }

  return (
    <div className="space-y-4">
      <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      <input ref={replaceRef} type="file" className="hidden" onChange={(e) => replace(e.target.files)} />

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`rounded-xl border-2 border-dashed transition p-8 text-center cursor-pointer ${
          drag ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:bg-muted/50"
        }`}
      >
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary mb-3">
          <Upload className="h-5 w-5" />
        </div>
        <div className="font-medium">Drop files here or click to upload</div>
        <div className="text-sm text-muted-foreground mt-1">
          PDF, DOCX, XLSX, PPTX, CSV, TXT — up to 25MB
        </div>
        <Button type="button" className="mt-4" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>Browse files</Button>
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
                        <Button size="sm" variant="ghost" onClick={() => setPreview(d)}><Eye className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => { setReplaceId(d.id); replaceRef.current?.click(); }}><RefreshCw className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDeleteId(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>{preview?.format} · {preview?.size} · Updated {preview?.updatedAt}</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
            <div className="font-medium text-foreground mb-1">{preview?.description}</div>
            Document preview is not available in this demo. The AI will use the latest published version when answering customer questions.
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>The AI will stop using it immediately.</AlertDialogDescription>
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

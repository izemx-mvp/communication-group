import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Search, Plus } from "lucide-react";

import { PageHeader, StatusBadge } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prospects, type LeadStatus, type LeadSource } from "@/lib/mock-data";

export const Route = createFileRoute("/prospects/")({
  head: () => ({
    meta: [
      { title: "Prospects — N7 Back Office" },
      { name: "description", content: "CRM list of every submitted contact form." },
    ],
  }),
  component: ProspectsList,
});

function ProspectsList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [source, setSource] = useState<string>("all");

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      const s = q.toLowerCase().trim();
      if (
        s &&
        !`${p.prenom} ${p.nom} ${p.societe} ${p.email} ${p.ville}`
          .toLowerCase()
          .includes(s)
      )
        return false;
      if (status !== "all" && p.status !== status) return false;
      if (source !== "all" && p.source !== source) return false;
      return true;
    });
  }, [q, status, source]);

  const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Won", "Lost"];
  const sources: LeadSource[] = ["Website", "WhatsApp", "Facebook", "Instagram", "LinkedIn"];

  return (
    <div>
      <PageHeader
        title="Prospects"
        description={`${filtered.length} of ${prospects.length} contacts`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1.5" /> Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" /> New prospect
            </Button>
          </>
        }
      />

      <Card className="shadow-soft">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, company…"
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                      No prospects match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-muted/40">
                      <TableCell className="font-medium">
                        <Link to="/prospects/$id" params={{ id: p.id }} className="hover:text-primary">
                          {p.nom}
                        </Link>
                      </TableCell>
                      <TableCell>{p.prenom}</TableCell>
                      <TableCell className="text-muted-foreground">{p.societe}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{p.email}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{p.telephone}</TableCell>
                      <TableCell className="hidden lg:table-cell">{p.pays}</TableCell>
                      <TableCell className="hidden xl:table-cell">{p.ville}</TableCell>
                      <TableCell>{p.source}</TableCell>
                      <TableCell><StatusBadge status={p.score} /></TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(p.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

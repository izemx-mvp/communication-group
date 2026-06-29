import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Flame,
  MessageCircle,
  Bot,
  ArrowUpRight,
  UserPlus,
  UserCheck,
  BookOpen,
  FileUp,
  Clock,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatusBadge } from "@/components/app-shell";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prospects, sourceData, activities } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — N7 Back Office" },
      { name: "description", content: "Overview of prospects, conversations and AI performance." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Total Prospects", value: "1,284", change: "+12.4%", icon: Users, tone: "primary" as const },
  { label: "Hot Leads", value: "187", change: "+8.1%", icon: Flame, tone: "warning" as const },
  { label: "Conversations Today", value: "342", change: "+24%", icon: MessageCircle, tone: "info" as const },
  { label: "AI Response Rate", value: "96.2%", change: "+1.4%", icon: Bot, tone: "success" as const },
];

const activityIcons: Record<string, typeof UserPlus> = {
  prospect: UserPlus,
  assign: UserCheck,
  knowledge: BookOpen,
  doc: FileUp,
  hours: Clock,
};

function Dashboard() {
  const recent = prospects.slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A quick pulse on your prospects and AI performance."
        actions={
          <Button asChild>
            <Link to="/prospects">
              View all prospects <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="shadow-soft hover:shadow-elevated transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{k.label}</div>
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <k.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</div>
                <div className="mt-1 text-xs font-medium text-success">{k.change} vs last week</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Prospects</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Latest submissions across all channels</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/prospects">See all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Lead Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/40">
                      <TableCell className="font-medium">
                        <Link to="/prospects/$id" params={{ id: p.id }} className="hover:text-primary">
                          {p.prenom} {p.nom}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.societe}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{p.email}</TableCell>
                      <TableCell>{p.source}</TableCell>
                      <TableCell><StatusBadge status={p.score} /></TableCell>
                      <TableCell><StatusBadge status={p.status} /></TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {new Date(p.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Latest events across the back office</p>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-4 ml-2">
              {activities.map((a) => {
                const Icon = activityIcons[a.type] || UserPlus;
                return (
                  <li key={a.id} className="relative pl-8">
                    <div className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.desc}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{a.time}</div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Lead Sources</CardTitle>
          <p className="text-sm text-muted-foreground">Where prospects are coming from</p>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {sourceData.map((_, i) => {
                    const colors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];
                    return <Cell key={i} fill={colors[i % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

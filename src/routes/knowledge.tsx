import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  FileText,
  HelpCircle,
  Briefcase,
  Files,
  Clock,
  MapPin,
  Phone,
  Plug,
  Sparkles,
  UserCog,

} from "lucide-react";

import { PageHeader } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Base de connaissances — N7 Back Office" },
      { name: "description", content: "Source unique de vérité pour l'Agent IA du service client." },
    ],
  }),
  component: KnowledgeLayout,
});

const tabs = [
  { to: "/knowledge", label: "Articles", icon: FileText, exact: true },
  { to: "/knowledge/faq", label: "FAQ", icon: HelpCircle },
  { to: "/knowledge/services", label: "Services", icon: Briefcase },
  { to: "/knowledge/documents", label: "Documents", icon: Files },
  { to: "/knowledge/business-hours", label: "Horaires d'ouverture", icon: Clock },
  { to: "/knowledge/locations", label: "Emplacements", icon: MapPin },
  { to: "/knowledge/contact", label: "Contact", icon: Phone },
  { to: "/knowledge/integrations", label: "Intégrations", icon: Plug },
  { to: "/knowledge/users", label: "Utilisateurs", icon: UserCog },
];

function KnowledgeLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div>
      <PageHeader
        title="Service Client AI"
        description="La base de connaissances qui alimente votre agent IA du service client."
      />

      <Card className="mb-5 shadow-soft bg-gradient-to-br from-accent/60 to-card border-primary/10">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-sm">
            <strong>Seul le contenu publié</strong> est accessible à l'IA. Les brouillons ne sont jamais utilisés dans les réponses aux clients.
          </div>
        </CardContent>
      </Card>


      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname === t.to || pathname.startsWith(t.to + "/");
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

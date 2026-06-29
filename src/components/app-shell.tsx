import n7LogoAsset from "@/assets/n7-logo.png.asset.json";
import { Link, useRouterState } from "@tanstack/react-router";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Search,
  Bell,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/prospects", label: "Prospects", icon: Users },
  { to: "/knowledge", label: "Knowledge Base", icon: BookOpen },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center px-4 h-16 border-b border-border">
          <div className="flex items-center justify-center w-full h-11 rounded-lg bg-foreground px-3">
            <img src={n7LogoAsset.url} alt="N7 Communication Group" className="h-7 w-auto" />
          </div>
        </div>


        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-dot"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="rounded-xl bg-gradient-to-br from-accent to-card p-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Agent
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Live and answering customers using your published knowledge.
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Online
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
          <div className="h-full px-4 md:px-6 flex items-center gap-3">
            <div className="md:hidden grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              N7
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects, articles, documents…"
                className="pl-9 h-9 bg-muted/60 border-transparent focus-visible:bg-background"
              />
              <kbd className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        YA
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left leading-tight">
                      <div className="text-sm font-medium">Yassine A.</div>
                      <div className="text-[11px] text-muted-foreground">Admin</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Published: "bg-success/15 text-success border-success/20",
    Draft: "bg-muted text-muted-foreground border-border",
    New: "bg-info/15 text-info border-info/20",
    Contacted: "bg-warning/15 text-warning-foreground border-warning/30",
    Qualified: "bg-accent text-accent-foreground border-primary/20",
    Won: "bg-success/15 text-success border-success/20",
    Lost: "bg-destructive/10 text-destructive border-destructive/20",
    Hot: "bg-primary/15 text-primary border-primary/30",
    Warm: "bg-warning/20 text-warning-foreground border-warning/30",
    Cold: "bg-info/10 text-info border-info/20",
  };
  return (
    <Badge variant="outline" className={cn("font-medium", map[status] || "")}>
      {status}
    </Badge>
  );
}

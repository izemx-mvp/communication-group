import { useSyncExternalStore } from "react";

export type UserRole = "Admin" | "Manager" | "Agent" | "Lecteur";
export type UserStatus = "Actif" | "Invité" | "Suspendu";

export type ModuleKey =
  | "dashboard"
  | "prospects"
  | "calendar"
  | "knowledge"
  | "integrations"
  | "users";

export const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "dashboard", label: "Tableau de bord" },
  { key: "prospects", label: "Qualification AI" },
  { key: "calendar", label: "Calendrier" },
  { key: "knowledge", label: "Service Client AI" },
  { key: "integrations", label: "Intégrations" },
  { key: "users", label: "Gestion des utilisateurs" },
];

export type CrudAction = "view" | "create" | "update" | "delete";
export const CRUD_ACTIONS: { key: CrudAction; label: string }[] = [
  { key: "view", label: "Voir" },
  { key: "create", label: "Créer" },
  { key: "update", label: "Modifier" },
  { key: "delete", label: "Supprimer" },
];

export type ModulePermissions = Record<ModuleKey, Record<CrudAction, boolean>>;

const noAccess = (): Record<CrudAction, boolean> => ({ view: false, create: false, update: false, delete: false });
const fullAccess = (): Record<CrudAction, boolean> => ({ view: true, create: true, update: true, delete: true });
const viewOnly = (): Record<CrudAction, boolean> => ({ view: true, create: false, update: false, delete: false });

export function emptyPermissions(): ModulePermissions {
  return MODULES.reduce((acc, m) => { acc[m.key] = noAccess(); return acc; }, {} as ModulePermissions);
}
function allPermissions(): ModulePermissions {
  return MODULES.reduce((acc, m) => { acc[m.key] = fullAccess(); return acc; }, {} as ModulePermissions);
}
function permsFor(view: ModuleKey[], write: ModuleKey[] = []): ModulePermissions {
  const p = emptyPermissions();
  view.forEach((k) => (p[k] = viewOnly()));
  write.forEach((k) => (p[k] = fullAccess()));
  return p;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  permissions: ModulePermissions;
}

const seed: AppUser[] = [
  { id: "u1", name: "Yassine Alaoui", email: "yassine@n7group.com", role: "Admin", status: "Actif", createdAt: "2025-11-02", permissions: allPermissions() },
  { id: "u2", name: "Fatima Zahra", email: "fatima@n7group.com", role: "Manager", status: "Actif", createdAt: "2025-12-14", permissions: permsFor(["dashboard", "knowledge", "integrations"], ["prospects", "calendar"]) },
  { id: "u3", name: "Hicham Benali", email: "hicham@n7group.com", role: "Agent", status: "Actif", createdAt: "2026-01-08", permissions: permsFor(["dashboard"], ["prospects", "calendar"]) },
  { id: "u4", name: "Sofia Idrissi", email: "sofia@n7group.com", role: "Agent", status: "Invité", createdAt: "2026-03-22", permissions: permsFor(["dashboard", "prospects"]) },
  { id: "u5", name: "Karim Chraibi", email: "karim@n7group.com", role: "Lecteur", status: "Suspendu", createdAt: "2026-04-11", permissions: permsFor(["dashboard"]) },
];

let state: AppUser[] = [...seed];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const usersStore = {
  getAll: () => state,
  add(u: Omit<AppUser, "id" | "createdAt">) {
    state = [{ ...u, id: `u_${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }, ...state];
    emit();
  },
  update(id: string, patch: Partial<AppUser>) {
    state = state.map((u) => (u.id === id ? { ...u, ...patch } : u));
    emit();
  },
  remove(id: string) {
    state = state.filter((u) => u.id !== id);
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useUsers() {
  return useSyncExternalStore(usersStore.subscribe, usersStore.getAll, usersStore.getAll);
}

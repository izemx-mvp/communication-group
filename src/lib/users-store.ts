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

const ALL: ModuleKey[] = MODULES.map((m) => m.key);

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  modules: ModuleKey[];
}

const seed: AppUser[] = [
  { id: "u1", name: "Yassine Alaoui", email: "yassine@n7group.com", role: "Admin", status: "Actif", createdAt: "2025-11-02", modules: ALL },
  { id: "u2", name: "Fatima Zahra", email: "fatima@n7group.com", role: "Manager", status: "Actif", createdAt: "2025-12-14", modules: ["dashboard", "prospects", "calendar", "knowledge", "integrations"] },
  { id: "u3", name: "Hicham Benali", email: "hicham@n7group.com", role: "Agent", status: "Actif", createdAt: "2026-01-08", modules: ["dashboard", "prospects", "calendar"] },
  { id: "u4", name: "Sofia Idrissi", email: "sofia@n7group.com", role: "Agent", status: "Invité", createdAt: "2026-03-22", modules: ["dashboard", "prospects"] },
  { id: "u5", name: "Karim Chraibi", email: "karim@n7group.com", role: "Lecteur", status: "Suspendu", createdAt: "2026-04-11", modules: ["dashboard"] },
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

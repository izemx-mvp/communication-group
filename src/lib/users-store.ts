import { useSyncExternalStore } from "react";

export type UserRole = "Admin" | "Manager" | "Agent" | "Lecteur";
export type UserStatus = "Actif" | "Invité" | "Suspendu";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

const seed: AppUser[] = [
  { id: "u1", name: "Yassine Alaoui", email: "yassine@n7group.com", role: "Admin", status: "Actif", createdAt: "2025-11-02" },
  { id: "u2", name: "Fatima Zahra", email: "fatima@n7group.com", role: "Manager", status: "Actif", createdAt: "2025-12-14" },
  { id: "u3", name: "Hicham Benali", email: "hicham@n7group.com", role: "Agent", status: "Actif", createdAt: "2026-01-08" },
  { id: "u4", name: "Sofia Idrissi", email: "sofia@n7group.com", role: "Agent", status: "Invité", createdAt: "2026-03-22" },
  { id: "u5", name: "Karim Chraibi", email: "karim@n7group.com", role: "Lecteur", status: "Suspendu", createdAt: "2026-04-11" },
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

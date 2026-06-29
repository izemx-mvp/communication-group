import { useSyncExternalStore } from "react";
import { prospects as seed, type Prospect } from "@/lib/mock-data";

let state: Prospect[] = [...seed];
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export const prospectsStore = {
  getAll: () => state,
  get: (id: string) => state.find((p) => p.id === id),
  add(p: Omit<Prospect, "id" | "date"> & Partial<Pick<Prospect, "id" | "date">>) {
    const next: Prospect = {
      id: p.id ?? `pr_${Date.now()}`,
      date: p.date ?? new Date().toISOString(),
      ...p,
    } as Prospect;
    state = [next, ...state];
    emit();
    return next;
  },
  update(id: string, patch: Partial<Prospect>) {
    state = state.map((p) => (p.id === id ? { ...p, ...patch } : p));
    emit();
  },
  remove(id: string) {
    state = state.filter((p) => p.id !== id);
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useProspects() {
  return useSyncExternalStore(prospectsStore.subscribe, prospectsStore.getAll, prospectsStore.getAll);
}

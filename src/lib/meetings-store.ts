import { useSyncExternalStore } from "react";

export interface Meeting {
  id: string;
  prospectId?: string;
  title: string;
  clientName: string;
  clientEmail: string;
  start: string; // ISO
  durationMin: number;
  meetLink: string;
  notes?: string;
}

function meetLink() {
  const s = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n: number) => Array.from({ length: n }, () => s[Math.floor(Math.random() * 26)]).join("");
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
}

function seed(): Meeting[] {
  const now = new Date();
  const mk = (offsetDays: number, hour: number, min: number, title: string, name: string, email: string, prospectId?: string) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays, hour, min, 0, 0);
    return {
      id: `mt_${Math.random().toString(36).slice(2, 9)}`,
      prospectId,
      title,
      clientName: name,
      clientEmail: email,
      start: d.toISOString(),
      durationMin: 30,
      meetLink: meetLink(),
      notes: "",
    } satisfies Meeting;
  };
  return [
    mk(0, 10, 0, "Démo produit — Agent IA", "Sophie Benali", "sophie.benali@atlasstudio.com", "pr_1000"),
    mk(1, 15, 30, "Cadrage intégration WhatsApp", "Karim Hassan", "karim.hassan@northwindco.com", "pr_1001"),
    mk(3, 11, 0, "Découverte besoins", "Amine Dupont", "amine.dupont@helioslabs.com", "pr_1002"),
    mk(5, 14, 0, "Point tarifs Enterprise", "Léa Mansouri", "lea.mansouri@maisonbleue.com"),
    mk(-2, 9, 30, "Onboarding kickoff", "Mehdi Chen", "mehdi.chen@orbitmedia.com"),
    mk(7, 16, 0, "Signature contrat", "Nora Garcia", "nora.garcia@cedarco.com"),
  ];
}

let state: Meeting[] = seed();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const meetingsStore = {
  getAll: () => state,
  get: (id: string) => state.find((m) => m.id === id),
  add(m: Omit<Meeting, "id" | "meetLink"> & Partial<Pick<Meeting, "id" | "meetLink">>) {
    const next: Meeting = {
      id: m.id ?? `mt_${Date.now()}`,
      meetLink: m.meetLink || meetLink(),
      ...m,
    } as Meeting;
    state = [...state, next];
    emit();
    return next;
  },
  update(id: string, patch: Partial<Meeting>) {
    state = state.map((m) => (m.id === id ? { ...m, ...patch } : m));
    emit();
  },
  remove(id: string) {
    state = state.filter((m) => m.id !== id);
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useMeetings() {
  return useSyncExternalStore(meetingsStore.subscribe, meetingsStore.getAll, meetingsStore.getAll);
}

export function generateMeetLink() {
  return meetLink();
}

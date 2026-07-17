import { useSyncExternalStore } from "react";

export type FieldType = "text" | "password" | "email" | "url";

export interface IntegrationField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
}

export interface IntegrationDef {
  id: string;
  name: string;
  category: string;
  description: string;
  logo: string; // URL
  fields: IntegrationField[];
  docsUrl?: string;
}

export interface IntegrationState {
  connected: boolean;
  active: boolean;
  account?: string; // display label
  values?: Record<string, string>;
  connectedAt?: string;
}

export const integrationDefs: IntegrationDef[] = [
  {
    id: "google_meet",
    name: "Google Meet",
    category: "Réunions",
    description: "Planifiez automatiquement des visioconférences avec vos prospects.",
    logo: "https://cdn.simpleicons.org/googlemeet",
    docsUrl: "https://developers.google.com/meet",
    fields: [
      { key: "clientId", label: "OAuth Client ID", type: "text", placeholder: "xxxxx.apps.googleusercontent.com" },
      { key: "clientSecret", label: "OAuth Client Secret", type: "password", placeholder: "GOCSPX-…" },
      { key: "redirectUri", label: "Redirect URI", type: "url", placeholder: "https://app.n7.ma/oauth/google/callback" },
      { key: "account", label: "Compte Google", type: "email", placeholder: "vous@n7group.com" },
    ],
  },
  {
    id: "google_calendar",
    name: "Google Calendar",
    category: "Réunions",
    description: "Synchronisez les rendez-vous et disponibilités de votre équipe.",
    logo: "https://cdn.simpleicons.org/googlecalendar",
    fields: [
      { key: "clientId", label: "OAuth Client ID", type: "text", placeholder: "xxxxx.apps.googleusercontent.com" },
      { key: "clientSecret", label: "OAuth Client Secret", type: "password" },
      { key: "calendarId", label: "Calendar ID", type: "text", placeholder: "primary" },
      { key: "account", label: "Compte Google", type: "email" },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    category: "Messagerie",
    description: "Connectez votre compte WhatsApp Business Cloud API.",
    logo: "https://cdn.simpleicons.org/whatsapp",
    fields: [
      { key: "phoneNumberId", label: "Phone Number ID", type: "text", placeholder: "123456789012345" },
      { key: "wabaId", label: "WhatsApp Business Account ID", type: "text" },
      { key: "accessToken", label: "Access Token permanent", type: "password", placeholder: "EAAG…" },
      { key: "verifyToken", label: "Webhook Verify Token", type: "password" },
    ],
  },
  {
    id: "facebook",
    name: "Facebook Messenger",
    category: "Messagerie",
    description: "Répondez aux messages de vos pages Facebook.",
    logo: "https://cdn.simpleicons.org/facebook",
    fields: [
      { key: "pageId", label: "Page ID", type: "text" },
      { key: "pageAccessToken", label: "Page Access Token", type: "password" },
      { key: "appSecret", label: "App Secret", type: "password" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram Direct",
    category: "Messagerie",
    description: "Recevez et répondez aux DM Instagram.",
    logo: "https://cdn.simpleicons.org/instagram",
    fields: [
      { key: "igUserId", label: "Instagram User ID", type: "text" },
      { key: "accessToken", label: "Access Token", type: "password" },
    ],
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Email",
    description: "Envoyez et recevez des emails via votre boîte Gmail.",
    logo: "https://cdn.simpleicons.org/gmail",
    fields: [
      { key: "clientId", label: "OAuth Client ID", type: "text" },
      { key: "clientSecret", label: "OAuth Client Secret", type: "password" },
      { key: "account", label: "Adresse Gmail", type: "email" },
    ],
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    category: "CRM",
    description: "Synchronisez prospects et contacts avec HubSpot.",
    logo: "https://cdn.simpleicons.org/hubspot",
    fields: [
      { key: "portalId", label: "Portal ID", type: "text" },
      { key: "privateAppToken", label: "Private App Token", type: "password", placeholder: "pat-na1-…" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    category: "Notifications",
    description: "Recevez les alertes prospects dans un canal Slack.",
    logo: "https://cdn.simpleicons.org/slack",
    fields: [
      { key: "botToken", label: "Bot User OAuth Token", type: "password", placeholder: "xoxb-…" },
      { key: "channelId", label: "Channel ID", type: "text", placeholder: "C0123456" },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Paiements",
    description: "Créez des liens de paiement pour vos prospects.",
    logo: "https://cdn.simpleicons.org/stripe",
    fields: [
      { key: "secretKey", label: "Secret Key", type: "password", placeholder: "sk_live_…" },
      { key: "webhookSecret", label: "Webhook Signing Secret", type: "password", placeholder: "whsec_…" },
    ],
  },
];

let state: Record<string, IntegrationState> = {
  google_meet: { connected: true, active: true, account: "yassine@n7group.com", connectedAt: new Date().toISOString() },
  whatsapp: { connected: true, active: true, account: "+212 661 000 000", connectedAt: new Date().toISOString() },
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const integrationsStore = {
  getAll: () => state,
  get: (id: string): IntegrationState => state[id] ?? { connected: false, active: false },
  connect(id: string, values: Record<string, string>) {
    const def = integrationDefs.find((d) => d.id === id);
    const account = values.account || values.pageId || values.calendarId || values.phoneNumberId || values.igUserId || values.portalId || values.channelId || def?.name || "Compte connecté";
    state = { ...state, [id]: { connected: true, active: true, account, values, connectedAt: new Date().toISOString() } };
    emit();
  },
  toggle(id: string, active: boolean) {
    const cur = state[id];
    if (!cur) return;
    state = { ...state, [id]: { ...cur, active } };
    emit();
  },
  disconnect(id: string) {
    const { [id]: _, ...rest } = state;
    state = rest;
    emit();
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useIntegrations() {
  return useSyncExternalStore(integrationsStore.subscribe, integrationsStore.getAll, integrationsStore.getAll);
}

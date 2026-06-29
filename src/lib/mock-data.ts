export type LeadScore = "Cold" | "Warm" | "Hot";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Won" | "Lost";
export type LeadSource = "Website" | "WhatsApp" | "Facebook" | "Instagram" | "LinkedIn";

export interface Prospect {
  id: string;
  nom: string;
  prenom: string;
  societe: string;
  email: string;
  telephone: string;
  pays: string;
  ville: string;
  source: LeadSource;
  score: LeadScore;
  status: LeadStatus;
  date: string;
  message: string;
  assignedTo: string;
  notes: string;
}

const firstNames = ["Sophie", "Karim", "Amine", "Léa", "Mehdi", "Nora", "Yacine", "Inès", "Sami", "Hana", "Omar", "Lina", "Adam", "Sarah", "Reda", "Yasmine"];
const lastNames = ["Benali", "Hassan", "Dupont", "Mansouri", "Chen", "Garcia", "Lefèvre", "Saidi", "Cherif", "Moreau", "Tazi", "Bennani", "Karam", "Idrissi"];
const companies = ["Atlas Studio", "Northwind Co", "Helios Labs", "Maison Bleue", "Orbit Media", "Cedar & Co", "Kova Tech", "Mira Group", "Phoenix Retail", "Lumen AI", "Verde Logistics", "Polar Bank"];
const cities = ["Casablanca", "Rabat", "Paris", "Lyon", "Marseille", "Tunis", "Dubai", "Madrid", "London", "Berlin"];
const countries = ["Morocco", "France", "Tunisia", "UAE", "Spain", "UK", "Germany"];
const sources: LeadSource[] = ["Website", "WhatsApp", "Facebook", "Instagram", "LinkedIn"];
const scores: LeadScore[] = ["Cold", "Warm", "Hot"];
const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Won", "Lost"];
const team = ["Yassine A.", "Fatima Z.", "Hicham B.", "Unassigned"];

function pick<T>(arr: T[], i: number) { return arr[i % arr.length]; }

export const prospects: Prospect[] = Array.from({ length: 42 }).map((_, i) => {
  const prenom = pick(firstNames, i * 3);
  const nom = pick(lastNames, i * 7);
  const societe = pick(companies, i * 5);
  const d = new Date();
  d.setDate(d.getDate() - i);
  return {
    id: `pr_${1000 + i}`,
    nom,
    prenom,
    societe,
    email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@${societe.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    telephone: `+212 6${Math.floor(10000000 + Math.random() * 89999999)}`,
    pays: pick(countries, i * 2),
    ville: pick(cities, i * 4),
    source: pick(sources, i),
    score: pick(scores, i * 2),
    status: pick(statuses, i),
    date: d.toISOString(),
    message: "Bonjour, je souhaite obtenir plus d'informations sur vos services d'IA pour notre service client. Pouvez-vous me contacter rapidement ?",
    assignedTo: pick(team, i * 3),
    notes: i % 3 === 0 ? "Suivi à effectuer après démonstration." : "",
  };
});

export const sourceData = sources.map((s) => ({
  name: s,
  value: prospects.filter((p) => p.source === s).length,
}));

export const dailyConversations = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    day: d.toLocaleDateString("en", { weekday: "short" }),
    conversations: 40 + Math.floor(Math.random() * 80),
    resolved: 30 + Math.floor(Math.random() * 60),
  };
});

export const activities = [
  { id: 1, type: "prospect", title: "New prospect received", desc: "Sophie Benali — Atlas Studio (Website)", time: "2 min ago" },
  { id: 2, type: "assign", title: "Prospect assigned", desc: "Karim Hassan → Yassine A.", time: "18 min ago" },
  { id: 3, type: "knowledge", title: "Knowledge updated", desc: "Article 'Pricing FAQ' published", time: "1 h ago" },
  { id: 4, type: "doc", title: "New document uploaded", desc: "Q4-pricing-guide.pdf added to Documents", time: "3 h ago" },
  { id: 5, type: "hours", title: "Business hours updated", desc: "Friday closing changed to 17:00", time: "Yesterday" },
  { id: 6, type: "prospect", title: "New prospect received", desc: "Omar Tazi — Lumen AI (LinkedIn)", time: "Yesterday" },
];

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  status: "Draft" | "Published";
  updatedAt: string;
}

export const articles: Article[] = [
  { id: "a1", title: "Getting started with N7 AI Agent", category: "Onboarding", content: "Welcome to the N7 AI Agent. This guide walks through the first steps...", tags: ["intro", "setup"], status: "Published", updatedAt: "2026-06-22" },
  { id: "a2", title: "Pricing & plans overview", category: "Pricing", content: "We offer Starter, Growth and Enterprise plans...", tags: ["pricing", "plans"], status: "Published", updatedAt: "2026-06-18" },
  { id: "a3", title: "Connecting WhatsApp Business", category: "Integrations", content: "Step-by-step guide to connect your WhatsApp Business account...", tags: ["whatsapp", "integration"], status: "Draft", updatedAt: "2026-06-15" },
  { id: "a4", title: "Refund policy", category: "Policies", content: "Our refund policy covers...", tags: ["refund", "policy"], status: "Published", updatedAt: "2026-05-30" },
];

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: "Draft" | "Published";
}

export const faqs: Faq[] = [
  { id: "f1", question: "How does the AI Customer Service Agent work?", answer: "It uses your published Knowledge Base to answer customer questions across all channels in real time.", category: "Product", status: "Published" },
  { id: "f2", question: "Which languages are supported?", answer: "English, French, Arabic and Spanish are supported natively.", category: "Product", status: "Published" },
  { id: "f3", question: "How long does onboarding take?", answer: "Typically between 3 and 7 business days.", category: "Onboarding", status: "Published" },
  { id: "f4", question: "Do you offer a trial?", answer: "Yes, a 14-day free trial is available on the Growth plan.", category: "Pricing", status: "Draft" },
];

export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  status: "Draft" | "Published";
}

export const services: Service[] = [
  { id: "s1", name: "AI Customer Service Agent", description: "24/7 multilingual AI assistant trained on your knowledge base.", price: "From €499/mo", status: "Published" },
  { id: "s2", name: "Lead Qualification", description: "Automated prospect scoring and qualification flows.", price: "From €299/mo", status: "Published" },
  { id: "s3", name: "Knowledge Base Setup", description: "We help you structure and import your existing knowledge.", price: "One-time €1,500", status: "Published" },
  { id: "s4", name: "Custom Integrations", description: "CRM, ERP and bespoke API integrations.", status: "Draft" },
];

export interface DocItem {
  id: string;
  title: string;
  category: string;
  description: string;
  format: "PDF" | "DOCX" | "XLSX" | "PPTX" | "CSV" | "TXT";
  size: string;
  status: "Draft" | "Published";
  uploadedAt: string;
  updatedAt: string;
}

export const documents: DocItem[] = [
  { id: "d1", title: "Q4 Pricing Guide", category: "Pricing", description: "Detailed pricing for Q4 with all packages.", format: "PDF", size: "1.2 MB", status: "Published", uploadedAt: "2026-06-20", updatedAt: "2026-06-21" },
  { id: "d2", title: "Company Brochure 2026", category: "Marketing", description: "Brand brochure used for prospect outreach.", format: "PDF", size: "3.4 MB", status: "Published", uploadedAt: "2026-06-10", updatedAt: "2026-06-10" },
  { id: "d3", title: "Onboarding Checklist", category: "Onboarding", description: "Customer onboarding internal checklist.", format: "DOCX", size: "180 KB", status: "Draft", uploadedAt: "2026-06-02", updatedAt: "2026-06-09" },
  { id: "d4", title: "Service Catalog", category: "Sales", description: "Full catalog of services with SKUs.", format: "XLSX", size: "420 KB", status: "Published", uploadedAt: "2026-05-28", updatedAt: "2026-06-05" },
];

export interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export const businessHours: BusinessHour[] = [
  { day: "Monday", open: "09:00", close: "18:00", closed: false },
  { day: "Tuesday", open: "09:00", close: "18:00", closed: false },
  { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
  { day: "Thursday", open: "09:00", close: "18:00", closed: false },
  { day: "Friday", open: "09:00", close: "17:00", closed: false },
  { day: "Saturday", open: "10:00", close: "14:00", closed: false },
  { day: "Sunday", open: "00:00", close: "00:00", closed: true },
];

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  mapsUrl: string;
  phone: string;
  email: string;
  notes: string;
}

export const locations: Location[] = [
  { id: "l1", name: "N7 Headquarters", address: "12 Boulevard Mohamed V", city: "Casablanca", country: "Morocco", mapsUrl: "https://maps.google.com", phone: "+212 522 000 000", email: "hq@n7group.com", notes: "Main reception on ground floor." },
  { id: "l2", name: "N7 Paris Office", address: "45 Rue La Boétie", city: "Paris", country: "France", mapsUrl: "https://maps.google.com", phone: "+33 1 00 00 00 00", email: "paris@n7group.com", notes: "By appointment only." },
];

export const contactInfo = {
  mainPhone: "+212 522 000 000",
  whatsapp: "+212 661 000 000",
  email: "hello@n7group.com",
  website: "https://n7group.com",
  facebook: "https://facebook.com/n7group",
  instagram: "https://instagram.com/n7group",
  linkedin: "https://linkedin.com/company/n7group",
};

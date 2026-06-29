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
    day: d.toLocaleDateString("fr", { weekday: "short" }),
    conversations: 40 + Math.floor(Math.random() * 80),
    resolved: 30 + Math.floor(Math.random() * 60),
  };
});

export const activities = [
  { id: 1, type: "prospect", title: "Nouveau prospect reçu", desc: "Sophie Benali — Atlas Studio (Site web)", time: "Il y a 2 min" },
  { id: 2, type: "assign", title: "Prospect assigné", desc: "Karim Hassan → Yassine A.", time: "Il y a 18 min" },
  { id: 3, type: "knowledge", title: "Connaissance mise à jour", desc: "Article « FAQ Tarifs » publié", time: "Il y a 1 h" },
  { id: 4, type: "doc", title: "Nouveau document téléversé", desc: "guide-tarifs-T4.pdf ajouté aux Documents", time: "Il y a 3 h" },
  { id: 5, type: "hours", title: "Horaires d'ouverture mis à jour", desc: "Fermeture du vendredi modifiée à 17h00", time: "Hier" },
  { id: 6, type: "prospect", title: "Nouveau prospect reçu", desc: "Omar Tazi — Lumen AI (LinkedIn)", time: "Hier" },
];

// French label helpers (data values stay in English for stable filtering)
export const statusLabel: Record<string, string> = {
  New: "Nouveau", Contacted: "Contacté", Qualified: "Qualifié", Won: "Gagné", Lost: "Perdu",
};
export const scoreLabel: Record<string, string> = { Hot: "Chaud", Warm: "Tiède", Cold: "Froid" };
export const sourceLabel: Record<string, string> = {
  Website: "Site web", WhatsApp: "WhatsApp", Facebook: "Facebook", Instagram: "Instagram", LinkedIn: "LinkedIn",
};
export const docStatusLabel: Record<string, string> = { Draft: "Brouillon", Published: "Publié" };


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
  { id: "a1", title: "Démarrer avec l'Agent IA N7", category: "Intégration", content: "Bienvenue dans l'Agent IA N7. Ce guide présente les premières étapes...", tags: ["intro", "configuration"], status: "Published", updatedAt: "2026-06-22" },
  { id: "a2", title: "Aperçu des tarifs et formules", category: "Tarifs", content: "Nous proposons les formules Starter, Growth et Enterprise...", tags: ["tarifs", "formules"], status: "Published", updatedAt: "2026-06-18" },
  { id: "a3", title: "Connecter WhatsApp Business", category: "Intégrations", content: "Guide étape par étape pour connecter votre compte WhatsApp Business...", tags: ["whatsapp", "intégration"], status: "Draft", updatedAt: "2026-06-15" },
  { id: "a4", title: "Politique de remboursement", category: "Politiques", content: "Notre politique de remboursement couvre...", tags: ["remboursement", "politique"], status: "Published", updatedAt: "2026-05-30" },
];


export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: "Draft" | "Published";
}

export const faqs: Faq[] = [
  { id: "f1", question: "Comment fonctionne l'Agent IA du service client ?", answer: "Il utilise votre Base de connaissances publiée pour répondre aux questions des clients sur tous les canaux, en temps réel.", category: "Produit", status: "Published" },
  { id: "f2", question: "Quelles langues sont prises en charge ?", answer: "Le français, l'anglais, l'arabe et l'espagnol sont pris en charge nativement.", category: "Produit", status: "Published" },
  { id: "f3", question: "Combien de temps prend l'intégration ?", answer: "En général entre 3 et 7 jours ouvrés.", category: "Intégration", status: "Published" },
  { id: "f4", question: "Proposez-vous un essai gratuit ?", answer: "Oui, un essai gratuit de 14 jours est disponible sur la formule Growth.", category: "Tarifs", status: "Draft" },
];


export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  status: "Draft" | "Published";
}

export const services: Service[] = [
  { id: "s1", name: "Agent IA du service client", description: "Assistant IA multilingue 24h/24 et 7j/7 entraîné sur votre base de connaissances.", price: "À partir de 499 €/mois", status: "Published" },
  { id: "s2", name: "Qualification de prospects", description: "Scoring et qualification automatisés des prospects.", price: "À partir de 299 €/mois", status: "Published" },
  { id: "s3", name: "Mise en place de la base de connaissances", description: "Nous vous aidons à structurer et importer vos contenus existants.", price: "1 500 € unique", status: "Published" },
  { id: "s4", name: "Intégrations sur mesure", description: "Intégrations CRM, ERP et API spécifiques.", status: "Draft" },
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
  { id: "d1", title: "Guide des tarifs T4", category: "Tarifs", description: "Tarification détaillée T4 avec toutes les offres.", format: "PDF", size: "1.2 Mo", status: "Published", uploadedAt: "2026-06-20", updatedAt: "2026-06-21" },
  { id: "d2", title: "Brochure entreprise 2026", category: "Marketing", description: "Brochure utilisée pour la prospection.", format: "PDF", size: "3.4 Mo", status: "Published", uploadedAt: "2026-06-10", updatedAt: "2026-06-10" },
  { id: "d3", title: "Checklist d'intégration", category: "Intégration", description: "Checklist interne d'intégration client.", format: "DOCX", size: "180 Ko", status: "Draft", uploadedAt: "2026-06-02", updatedAt: "2026-06-09" },
  { id: "d4", title: "Catalogue de services", category: "Ventes", description: "Catalogue complet des services avec références.", format: "XLSX", size: "420 Ko", status: "Published", uploadedAt: "2026-05-28", updatedAt: "2026-06-05" },
];

export interface BusinessHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export const businessHours: BusinessHour[] = [
  { day: "Lundi", open: "09:00", close: "18:00", closed: false },
  { day: "Mardi", open: "09:00", close: "18:00", closed: false },
  { day: "Mercredi", open: "09:00", close: "18:00", closed: false },
  { day: "Jeudi", open: "09:00", close: "18:00", closed: false },
  { day: "Vendredi", open: "09:00", close: "17:00", closed: false },
  { day: "Samedi", open: "10:00", close: "14:00", closed: false },
  { day: "Dimanche", open: "00:00", close: "00:00", closed: true },
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
  { id: "l1", name: "Siège N7", address: "12 Boulevard Mohamed V", city: "Casablanca", country: "Maroc", mapsUrl: "https://maps.google.com", phone: "+212 522 000 000", email: "hq@n7group.com", notes: "Réception principale au rez-de-chaussée." },
  { id: "l2", name: "Bureau N7 Paris", address: "45 Rue La Boétie", city: "Paris", country: "France", mapsUrl: "https://maps.google.com", phone: "+33 1 00 00 00 00", email: "paris@n7group.com", notes: "Sur rendez-vous uniquement." },
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

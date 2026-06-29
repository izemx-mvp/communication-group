import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Phone, MessageCircle, Mail, Globe, Facebook, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { contactInfo } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/contact")({
  component: ContactPage,
});

const fields = [
  { key: "mainPhone", label: "Téléphone principal", icon: Phone },
  { key: "whatsapp", label: "Numéro WhatsApp", icon: MessageCircle },
  { key: "email", label: "Email", icon: Mail },
  { key: "website", label: "Site web", icon: Globe },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
] as const;

function ContactPage() {
  const [info, setInfo] = useState({ ...contactInfo });

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Coordonnées</CardTitle>
          <p className="text-sm text-muted-foreground">Utilisées par l'IA chaque fois qu'un client demande comment nous contacter.</p>
        </div>
        <Button size="sm" onClick={() => toast.success("Coordonnées enregistrées")}>
          <Save className="h-4 w-4 mr-1.5" /> Enregistrer
        </Button>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, icon: Icon }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-sm">{label}</Label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={info[key]}
                onChange={(e) => setInfo({ ...info, [key]: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

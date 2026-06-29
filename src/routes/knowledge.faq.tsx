import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/app-shell";
import { faqs } from "@/lib/mock-data";

export const Route = createFileRoute("/knowledge/faq")({
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => toast.success("New question")}>
          <Plus className="h-4 w-4 mr-1.5" /> New question
        </Button>
      </div>
      <Card className="shadow-soft p-2">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id} className="border-b last:border-0 px-3">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span className="font-medium">{f.question}</span>
                  <StatusBadge status={f.status} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{f.answer}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-primary font-medium">{f.category}</span>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => toast.success("Editing")}><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast.error("Deleted")}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}

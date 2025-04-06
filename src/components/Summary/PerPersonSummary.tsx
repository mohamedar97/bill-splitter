"use client";

import { Separator } from "@/components/ui/separator";
import { PersonSummary } from "./types";
import { useBillSplitter } from "@/contexts/bill-splitter-context";

interface PerPersonSummaryProps {
  personSummaries: Record<string, PersonSummary>;
}

export function PerPersonSummary({ personSummaries }: PerPersonSummaryProps) {
  const { vat, serviceCharge } = useBillSplitter();

  return (
    <div className="space-y-4">
      {Object.entries(personSummaries).map(([person, summary]) => (
        <div key={person} className="space-y-2">
          <h3 className="font-medium">
            {person} - {summary.amount.toFixed(2)} EGP
          </h3>
          <div className="space-y-1">
            {summary.items.map((item) => {
              const sharePercentage = (1 / item.sharedBy.length) * 100;
              const personShare = item.price / item.sharedBy.length;
              const serviceAmount = (personShare * serviceCharge) / 100;
              const subtotal = personShare + serviceAmount;
              const vatAmount = (subtotal * vat) / 100;
              const totalShare = subtotal + vatAmount;

              return (
                <div
                  key={`${person}-${item.id}`}
                  className="flex justify-between text-sm p-2 bg-muted rounded-md"
                >
                  <span>{item.name || "Unnamed item"}</span>
                  <div className="text-right">
                    <div>{totalShare.toFixed(2)} EGP</div>
                    <div className="text-xs text-muted-foreground">
                      ({personShare.toFixed(2)} + {serviceAmount.toFixed(2)}{" "}
                      service + {vatAmount.toFixed(2)} VAT)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sharePercentage.toFixed(0)}% of item (
                      {item.sharedBy.length} people)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Separator />
        </div>
      ))}
    </div>
  );
}

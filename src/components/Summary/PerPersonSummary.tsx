"use client";

import { Separator } from "@/components/ui/separator";
import { PersonSummary } from "./types";

interface PerPersonSummaryProps {
  personSummaries: Record<string, PersonSummary>;
}

export function PerPersonSummary({ personSummaries }: PerPersonSummaryProps) {
  return (
    <div className="space-y-4">
      {Object.entries(personSummaries).map(([person, summary]) => (
        <div key={person} className="space-y-2">
          <h3 className="font-medium">
            {person} - {summary.amount.toFixed(2)} EGP
          </h3>
          <div className="space-y-1">
            {summary.items.map((item) => {
              const personShare = item.price / item.sharedBy.length;
              return (
                <div
                  key={`${person}-${item.id}`}
                  className="flex justify-between text-sm p-2 bg-muted rounded-md"
                >
                  <span>{item.name || "Unnamed item"}</span>
                  <div className="text-right">
                    <div>{personShare.toFixed(2)} EGP</div>
                    <div className="text-xs text-muted-foreground">
                      ({item.price.toFixed(2)} EGP ÷ {item.sharedBy.length})
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

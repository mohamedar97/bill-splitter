"use client";

import { Separator } from "@/components/ui/separator";
import { PersonSummary, TotalCalculation } from "./types";

interface SummaryOverviewProps {
  personSummaries: Record<string, PersonSummary>;
  totals: TotalCalculation;
  serviceCharge: number;
  vat: number;
}

export function SummaryOverview({
  personSummaries,
  totals,
  serviceCharge,
  vat,
}: SummaryOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Items Total:</span>
          <span>{totals.itemsTotal.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between">
          <span>Service Charge ({serviceCharge}%):</span>
          <span>{totals.serviceChargeAmount.toFixed(2)} EGP</span>
        </div>
        <div className="flex justify-between">
          <span>VAT ({vat}%):</span>
          <span>{totals.vatAmount.toFixed(2)} EGP</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>{totals.total.toFixed(2)} EGP</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="font-medium">Each Person Pays:</h3>
        {Object.entries(personSummaries).map(([person, summary]) => (
          <div
            key={person}
            className="flex justify-between p-2 bg-muted rounded-md"
          >
            <span>{person}</span>
            <span className="font-medium">{summary.amount.toFixed(2)} EGP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

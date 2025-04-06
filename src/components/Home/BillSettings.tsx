"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BillSettingsProps {
  vat: number;
  serviceCharge: number;
  updateVat: (value: number) => void;
  updateServiceCharge: (value: number) => void;
}

export function BillSettings({
  vat,
  serviceCharge,
  updateVat,
  updateServiceCharge,
}: BillSettingsProps) {
  return (
    <>
      <div className="space-y-4">
        <Label htmlFor="vat">VAT (%)</Label>
        <Input
          id="vat"
          type="number"
          min="0"
          step="0.1"
          value={vat}
          onChange={(e) => updateVat(Number.parseFloat(e.target.value))}
          required
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="serviceCharge">Service Charge (%)</Label>
        <Input
          id="serviceCharge"
          type="number"
          min="0"
          step="0.1"
          value={serviceCharge}
          onChange={(e) =>
            updateServiceCharge(Number.parseFloat(e.target.value))
          }
          required
        />
      </div>
    </>
  );
}

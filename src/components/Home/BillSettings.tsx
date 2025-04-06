"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BillSettingsProps {
  vat: number;
  serviceCharge: number;
  updateVat: (value: number) => void;
  updateServiceCharge: (value: number) => void;
  clearVat?: () => void;
  clearServiceCharge?: () => void;
}

export function BillSettings({
  vat,
  serviceCharge,
  updateVat,
  updateServiceCharge,
  clearVat = () => updateVat(0),
  clearServiceCharge = () => updateServiceCharge(0),
}: BillSettingsProps) {
  return (
    <>
      <div className="space-y-4">
        <Label htmlFor="vat">VAT (%)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="vat"
            type="number"
            min="0"
            step="0.5"
            value={vat}
            onChange={(e) => updateVat(Number.parseFloat(e.target.value))}
            required
          />

          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={clearVat}
            aria-label="Clear VAT"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="serviceCharge">Service Charge (%)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="serviceCharge"
            type="number"
            min="0"
            step="0.5"
            value={serviceCharge}
            onChange={(e) =>
              updateServiceCharge(Number.parseFloat(e.target.value))
            }
            required
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={clearServiceCharge}
            aria-label="Clear Service Charge"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

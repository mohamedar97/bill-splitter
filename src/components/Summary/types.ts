import type { BillItem } from "@/contexts/bill-splitter-context";

export interface PersonSummary {
  items: BillItem[];
  amount: number;
}

export interface TotalCalculation {
  itemsTotal: number;
  serviceChargeAmount: number;
  vatAmount: number;
  total: number;
}

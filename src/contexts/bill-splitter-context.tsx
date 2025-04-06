"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface BillItem {
  id: string;
  name: string;
  price: number;
  sharedBy: string[];
}

interface BillSplitterContextType {
  // State
  people: string[];
  vat: number;
  serviceCharge: number;
  items: BillItem[];

  // People methods
  addPerson: (name: string) => void;
  removePerson: (index: number) => void;

  // Settings methods
  updateVat: (value: number) => void;
  updateServiceCharge: (value: number) => void;

  // Item methods
  addItem: (item: Omit<BillItem, "id">) => void;
  updateItem: (id: string, item: Omit<BillItem, "id">) => void;
  removeItem: (id: string) => void;

  // Calculations
  calculateTotal: () => {
    itemsTotal: number;
    serviceChargeAmount: number;
    vatAmount: number;
    total: number;
  };

  // Reset
  resetAll: () => void;
}

const BillSplitterContext = createContext<BillSplitterContextType | undefined>(
  undefined
);

export function BillSplitterProvider({ children }: { children: ReactNode }) {
  // State
  const [people, setPeople] = useState<string[]>([]);
  const [vat, setVat] = useState<number>(14);
  const [serviceCharge, setServiceCharge] = useState<number>(12);
  const [items, setItems] = useState<BillItem[]>([]);

  // People methods
  const addPerson = (name: string) => {
    if (name.trim() !== "" && !people.includes(name.trim())) {
      setPeople([...people, name.trim()]);
    }
  };

  const removePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));

    // Also remove this person from any items they're sharing
    setItems(
      items
        .map((item) => {
          const personName = people[index];
          if (item.sharedBy.includes(personName)) {
            return {
              ...item,
              sharedBy: item.sharedBy.filter((p) => p !== personName),
            };
          }
          return item;
        })
        .filter((item) => item.sharedBy.length > 0)
    ); // Remove items with no people sharing
  };

  // Settings methods
  const updateVat = (value: number) => {
    setVat(value);
  };

  const updateServiceCharge = (value: number) => {
    setServiceCharge(value);
  };

  // Item methods
  const addItem = (item: Omit<BillItem, "id">) => {
    const newItem: BillItem = {
      id: Date.now().toString(),
      ...item,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updatedItem: Omit<BillItem, "id">) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculations
  const calculateTotal = () => {
    const itemsTotal = items.reduce((sum, item) => sum + item.price, 0);
    const serviceChargeAmount = itemsTotal * (serviceCharge / 100);
    const subtotal = itemsTotal + serviceChargeAmount;
    const vatAmount = subtotal * (vat / 100);
    return {
      itemsTotal,
      serviceChargeAmount,
      vatAmount,
      total: subtotal + vatAmount,
    };
  };

  // Reset
  const resetAll = () => {
    setPeople([]);
    setVat(14);
    setServiceCharge(12);
    setItems([]);
  };

  const value = {
    people,
    vat,
    serviceCharge,
    items,
    addPerson,
    removePerson,
    updateVat,
    updateServiceCharge,
    addItem,
    updateItem,
    removeItem,
    calculateTotal,
    resetAll,
  };

  return (
    <BillSplitterContext.Provider value={value}>
      {children}
    </BillSplitterContext.Provider>
  );
}

export function useBillSplitter() {
  const context = useContext(BillSplitterContext);
  if (context === undefined) {
    throw new Error(
      "useBillSplitter must be used within a BillSplitterProvider"
    );
  }
  return context;
}

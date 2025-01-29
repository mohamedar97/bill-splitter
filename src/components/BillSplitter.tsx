"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { OrderForm } from "./OrderForm";
import { BillSummary } from "./BillSummary";
import { SettingsForm } from "./SettingsForm";

interface OrderItem {
  id: string;
  price: number;
  assignedTo: string[];
}

interface Person {
  id: string;
  name: string;
}

export default function BillSplitter() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [vat, setVat] = useState(14);
  const [serviceFee, setServiceFee] = useState(12);
  const [people, setPeople] = useState<Person[]>([{ id: "1", name: "Raafat" }]);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const addOrderItem = (item: OrderItem) => {
    setOrderItems([...orderItems, item]);
    setIsOrderFormOpen(false);
  };

  const updateSettings = (
    newVat: number,
    newServiceFee: number,
    newPeople: Person[]
  ) => {
    setVat(newVat);
    setServiceFee(newServiceFee);
    setPeople(newPeople);
    setIsSettingsOpen(false);

    // Update existing order items if people have been removed
    const updatedOrderItems = orderItems.map((item) => ({
      ...item,
      assignedTo: item.assignedTo.filter(
        (personId) =>
          newPeople.some((p) => p.id === personId) || personId === "Shared"
      ),
    }));
    setOrderItems(updatedOrderItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-6">
        <Button
          className="flex-1 h-12 text-base sm:flex-initial sm:px-8"
          onClick={() => setIsOrderFormOpen(true)}
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add Item
        </Button>
        <Button
          variant="outline"
          className="h-12 aspect-square"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div>
        <BillSummary
          orderItems={orderItems}
          vat={vat}
          serviceFee={serviceFee}
          people={people}
        />
      </div>

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        addOrderItem={addOrderItem}
        people={people}
      />
      <SettingsForm
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        updateSettings={updateSettings}
        initialVat={vat}
        initialServiceFee={serviceFee}
        initialPeople={people}
      />
    </div>
  );
}

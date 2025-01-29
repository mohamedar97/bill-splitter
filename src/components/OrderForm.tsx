"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Person {
  id: string;
  name: string;
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  addOrderItem: (item: {
    id: string;
    name: string;
    price: number;
    assignedTo: string[];
  }) => void;
  people: Person[];
}

export function OrderForm({
  isOpen,
  onClose,
  addOrderItem,
  people,
}: OrderFormProps) {
  const [itemPrice, setItemPrice] = useState("");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemPrice && assignedTo.length > 0) {
      addOrderItem({
        id: Date.now().toString(),
        name: `Item ${Date.now()}`,
        price: Number.parseFloat(itemPrice),
        assignedTo,
      });
      setItemPrice("");
      setAssignedTo([]);
      onClose();
    }
  };

  const togglePerson = (id: string) => {
    setAssignedTo((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg h-[88vh] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 overflow-hidden"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="itemPrice">Price</Label>
              <Input
                id="itemPrice"
                type="number"
                inputMode="decimal"
                step="0.01"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Label>Assigned To</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-[30vh] overflow-y-auto p-1">
              {people.map((person) => (
                <Button
                  key={person.id}
                  type="button"
                  variant={
                    assignedTo.includes(person.id) ? "default" : "outline"
                  }
                  className="h-16 text-base"
                  onClick={() => togglePerson(person.id)}
                >
                  {person.name}
                </Button>
              ))}
              <Button
                type="button"
                variant={assignedTo.includes("Shared") ? "default" : "outline"}
                className="h-16 text-base col-span-2"
                onClick={() => togglePerson("Shared")}
              >
                Shared
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full h-12 text-base">
              Add Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

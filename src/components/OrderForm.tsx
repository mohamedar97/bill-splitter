"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
  addOrderItem: (
    items: Array<{
      id: string;
      name: string;
      price: number;
      assignedTo: string[];
    }>
  ) => void;
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
  const [orderItems, setOrderItems] = useState<
    {
      itemPrice: string;
      assignedTo: string[];
    }[]
  >([
    {
      itemPrice: "",
      assignedTo: [],
    },
  ]);
  const addItemToFormState = (
    e: React.FormEvent,
    item: {
      itemPrice: string;
      assignedTo: string[];
    }
  ) => {
    e.preventDefault();
    setOrderItems([...orderItems, item]);
    setItemPrice("");
    setAssignedTo([]);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalItems = [...orderItems];
    // Add current item to orderItems if it has values
    if (itemPrice && assignedTo.length > 0) {
      finalItems.push({ itemPrice, assignedTo });
    }

    // Convert all collected items to the format expected by addOrderItem
    const itemsToAdd = finalItems
      .filter((item) => item.itemPrice && item.assignedTo.length > 0)
      .map((item) => ({
        id: Date.now().toString() + Math.random(),
        name: `Item ${Date.now()}`,
        price: Number.parseFloat(item.itemPrice),
        assignedTo: item.assignedTo,
      }));

    if (itemsToAdd.length > 0) {
      addOrderItem(itemsToAdd);
      // Reset the form state
      setOrderItems([{ itemPrice: "", assignedTo: [] }]);
      setItemPrice("");
      setAssignedTo([]);
    }
    onClose();
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

        <Button
          type="button"
          variant="outline"
          onClick={(e) => addItemToFormState(e, { itemPrice, assignedTo })}
          className="w-full h-12 text-base flex items-center justify-center gap-2 hover:bg-primary/10"
        >
          <Plus className="w-5 h-5" />
          Add Another Item
        </Button>

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
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Label>Assigned To</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-[30vh] overflow-y-auto p-1">
              <Button
                type="button"
                variant={assignedTo.includes("Shared") ? "default" : "outline"}
                className="h-16 text-base col-span-2"
                onClick={() => togglePerson("Shared")}
              >
                Shared
              </Button>
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
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full mt-2 h-12 text-base">
              Update Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

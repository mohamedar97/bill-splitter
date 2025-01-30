"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Person {
  id: string;
  name: string;
}

interface SettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  updateSettings: (vat: number, serviceFee: number, people: Person[]) => void;
  initialVat: number;
  initialServiceFee: number;
  initialPeople: Person[];
}

export function SettingsForm({
  isOpen,
  onClose,
  updateSettings,
  initialVat,
  initialServiceFee,
  initialPeople,
}: SettingsFormProps) {
  const [vat, setVat] = useState(initialVat.toString());
  const [serviceFee, setServiceFee] = useState(initialServiceFee.toString());
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [newPersonName, setNewPersonName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPeople = [...people];
    if (newPersonName.trim()) {
      addPerson(newPersonName);
      finalPeople.push({
        id: (Math.random() * 100000).toString(),
        name: newPersonName.trim(),
      });
    }
    updateSettings(
      Number.parseFloat(vat) || 0,
      Number.parseFloat(serviceFee) || 0,
      finalPeople
    );
    onClose();
  };

  const addPerson = (name: string) => {
    if (name.trim()) {
      const newId = (
        Math.max(...people.map((p) => Number.parseInt(p.id)), 0) + 1
      ).toString();
      setPeople([...people, { id: newId, name: name.trim() }]);
      setNewPersonName("");
    }
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  const updatePersonName = (id: string, newName: string) => {
    setPeople(
      people.map((person) =>
        person.id === id ? { ...person, name: newName } : person
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg h-[88vh] flex flex-col">
        <div className="p-4 border-b">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-auto p-4"
        >
          <div className="space-y-4">
            <div>
              <Label>People</Label>
              <div className="space-y-2 mt-2 max-h-[30vh] overflow-y-auto">
                {people.map((person) => (
                  <div key={person.id} className="flex items-center gap-2">
                    <Input
                      value={person.name}
                      onChange={(e) =>
                        updatePersonName(person.id, e.target.value)
                      }
                      className="h-12 text-base"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0"
                      onClick={() => removePerson(person.id)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                <Input
                  placeholder="Add new person"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPerson(newPersonName);
                    }
                  }}
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div>
                <Label htmlFor="vat">VAT (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="vat"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}
                    className="h-12 text-base"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    onClick={() => setVat("0")}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="serviceFee">Service Fee (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="serviceFee"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(e.target.value)}
                    className="h-12 text-base"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0"
                    onClick={() => setServiceFee("0")}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-background mt-4 border-t">
            <Button type="submit" className="w-full h-12 text-base">
              Update Settings
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

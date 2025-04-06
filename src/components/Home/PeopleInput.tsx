"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PeopleInputProps {
  people: string[];
  addPerson: (name: string) => void;
  removePerson: (index: number) => void;
}

export function PeopleInput({
  people,
  addPerson,
  removePerson,
}: PeopleInputProps) {
  const [newPerson, setNewPerson] = useState("");

  const handleAddPerson = () => {
    if (newPerson.trim()) {
      addPerson(newPerson);
      setNewPerson("");
    }
  };

  return (
    <div className="space-y-4">
      <Label>People</Label>
      <div className="flex space-x-2">
        <Input
          placeholder="Enter name"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddPerson();
            }
          }}
        />
        <Button type="button" onClick={handleAddPerson} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mt-2">
        {people.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add at least one person
          </p>
        ) : (
          people.map((person, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <span>{person}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePerson(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

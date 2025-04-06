import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type BillItem } from "@/contexts/bill-splitter-context";
import { Plus, Users, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ItemFormProps {
  people: string[];
  onAddOrUpdateItem: (item: Omit<BillItem, "id">) => void;
  editingItem: BillItem | null;
  onCancelEdit: () => void;
}

export function ItemForm({
  people,
  onAddOrUpdateItem,
  editingItem,
  onCancelEdit,
}: ItemFormProps) {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  // Update form when editing an item
  useEffect(() => {
    if (editingItem) {
      setItemName(editingItem.name);
      setItemPrice(editingItem.price.toString());
      setSelectedPeople(editingItem.sharedBy);
    }
  }, [editingItem]);

  const togglePerson = (person: string) => {
    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter((p) => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const selectAllPeople = () => {
    if (selectedPeople.length === people.length) {
      setSelectedPeople([]);
    } else {
      setSelectedPeople([...people]);
    }
  };

  const handleSubmit = () => {
    if (Number.parseFloat(itemPrice) > 0 && selectedPeople.length > 0) {
      onAddOrUpdateItem({
        name: itemName.trim(),
        price: Number.parseFloat(itemPrice),
        sharedBy: [...selectedPeople],
      });

      // Reset form
      resetForm();
    }
  };

  const resetForm = () => {
    setItemName("");
    setItemPrice("");
    setSelectedPeople([]);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <h3 className="font-medium">
        {editingItem ? "Edit Item" : "Add New Item"}
      </h3>

      <div className="space-y-2">
        <Label htmlFor="itemName">Item Name (Optional)</Label>
        <Input
          id="itemName"
          placeholder="e.g., Pizza"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="itemPrice">Price</Label>
        <Input
          id="itemPrice"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Shared By</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAllPeople}
            className="h-8 text-xs"
          >
            <Users className="h-3 w-3 mr-1" />
            {selectedPeople.length === people.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {people.map((person) => (
            <Button
              key={person}
              type="button"
              variant={selectedPeople.includes(person) ? "default" : "outline"}
              className="justify-start h-10 px-3"
              onClick={() => togglePerson(person)}
            >
              {person}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={
            Number.parseFloat(itemPrice) <= 0 || selectedPeople.length === 0
          }
          className="flex-1"
        >
          {editingItem ? (
            <>Save Changes</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </>
          )}
        </Button>

        {editingItem && (
          <Button variant="outline" onClick={onCancelEdit}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

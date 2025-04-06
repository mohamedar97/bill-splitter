import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";

interface ExtractedItem {
  name: string;
  price: number;
  confirmed: boolean;
}

interface ItemConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  extractedItems: ExtractedItem[];
  currentItemIndex: number;
  selectedPeople: string[];
  people: string[];
  onTogglePerson: (person: string) => void;
  onSelectAllPeople: () => void;
  onConfirm: () => void;
  onSkip: () => void;
}

export function ItemConfirmationDialog({
  isOpen,
  onClose,
  extractedItems,
  currentItemIndex,
  selectedPeople,
  people,
  onTogglePerson,
  onSelectAllPeople,
  onConfirm,
  onSkip,
}: ItemConfirmationDialogProps) {
  const currentExtractedItem = extractedItems[currentItemIndex];
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  useEffect(() => {
    if (currentExtractedItem) {
      setItemName(currentExtractedItem.name);
      setItemPrice(currentExtractedItem.price.toString());
    }
  }, [currentExtractedItem, currentItemIndex]);

  if (!currentExtractedItem) {
    return null;
  }

  const handleConfirm = () => {
    // Update the current item with edited values
    if (currentExtractedItem) {
      currentExtractedItem.name = itemName.trim();
      currentExtractedItem.price =
        Number(itemPrice) || currentExtractedItem.price;
    }
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Item</DialogTitle>
          <DialogDescription>
            Item {currentItemIndex + 1} of {extractedItems.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="itemPrice">Price</Label>
              <Input
                id="itemPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Verify the amount is accurate before confirming.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Shared By</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSelectAllPeople}
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
                  variant={
                    selectedPeople.includes(person) ? "default" : "outline"
                  }
                  className="justify-start h-10 px-3"
                  onClick={() => onTogglePerson(person)}
                >
                  {person}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            className="sm:w-full"
          >
            Skip
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={
              selectedPeople.length === 0 ||
              !itemName.trim() ||
              Number(itemPrice) <= 0
            }
            className="sm:w-full"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { ExtractedItem };

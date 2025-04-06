import { Button } from "@/components/ui/button";
import { type BillItem } from "@/contexts/bill-splitter-context";
import { Pencil, Trash2 } from "lucide-react";

interface ItemListProps {
  items: BillItem[];
  onEditItem: (item: BillItem) => void;
  onRemoveItem: (id: string) => void;
  editingItemId: string | null;
}

export function ItemList({
  items,
  onEditItem,
  onRemoveItem,
  editingItemId,
}: ItemListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No items added yet</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-start justify-between p-3 rounded-md ${
            editingItemId === item.id
              ? "bg-primary/10 border border-primary"
              : "bg-muted"
          }`}
        >
          <div className="overflow-hidden">
            <div className="font-medium truncate max-w-[200px]">
              {item.name || "Unnamed item"}
            </div>
            <div className="text-sm text-muted-foreground">
              {item.price.toFixed(2)} EGP • Shared by {item.sharedBy.join(", ")}
            </div>
          </div>
          <div className="flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onEditItem(item)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveItem(item.id)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processReceipt } from "../../app/items/actions";
import {
  useBillSplitter,
  type BillItem,
} from "@/contexts/bill-splitter-context";

import {
  ItemForm,
  ItemList,
  ReceiptScanner,
  ItemConfirmationDialog,
  type ExtractedItem,
} from "./";

export function AddItemsForm() {
  const router = useRouter();
  const { people, items, addItem, updateItem, removeItem } = useBillSplitter();

  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Receipt processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

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

  const handleAddOrUpdateItem = (itemData: Omit<BillItem, "id">) => {
    if (editingItemId) {
      // Update existing item
      updateItem(editingItemId, itemData);
    } else {
      // Add new item
      addItem(itemData);
    }

    // Reset form
    setEditingItemId(null);
  };

  const editItem = (item: BillItem) => {
    setSelectedPeople(item.sharedBy);
    setEditingItemId(item.id);

    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setSelectedPeople([]);
  };

  const viewSummary = () => {
    router.push("/summary");
  };

  // Receipt processing functions
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("receipt", file);

      // Call the server action to process the receipt
      const processedReceipt = await processReceipt(formData);

      if (processedReceipt.error || !processedReceipt.extractedItems) {
        toast.error(processedReceipt.error || "Failed to process receipt");
        return;
      }

      setExtractedItems(
        processedReceipt.extractedItems.map((item) => ({
          ...item,
          confirmed: false,
        }))
      );
      setCurrentItemIndex(0);
      setIsConfirmationDialogOpen(true);
    } catch (error) {
      toast.error(
        `Failed to process receipt: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try again or add items manually.`
      );
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const confirmCurrentItem = () => {
    if (!extractedItems.length || currentItemIndex >= extractedItems.length)
      return;

    const currentItem = extractedItems[currentItemIndex];

    // Add the confirmed item to the items list
    addItem({
      name: currentItem.name,
      price: currentItem.price,
      sharedBy: [...selectedPeople],
    });

    // Mark the current item as confirmed
    const updatedExtractedItems = [...extractedItems];
    updatedExtractedItems[currentItemIndex].confirmed = true;
    setExtractedItems(updatedExtractedItems);

    // Move to the next item or close the dialog if all items are confirmed
    if (currentItemIndex < extractedItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setSelectedPeople([]); // Reset selected people for the next item
    } else {
      setIsConfirmationDialogOpen(false);
    }
  };

  const skipCurrentItem = () => {
    if (!extractedItems.length || currentItemIndex >= extractedItems.length)
      return;

    // Move to the next item or close the dialog if all items are processed
    if (currentItemIndex < extractedItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setSelectedPeople([]); // Reset selected people for the next item
    } else {
      setIsConfirmationDialogOpen(false);
    }
  };

  const closeConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false);
    setExtractedItems([]);
    setCurrentItemIndex(0);
  };

  // Add useEffect to handle navigation when people array is empty
  useEffect(() => {
    if (people.length === 0) {
      router.push("/");
    }
  }, [people.length, router]);

  // Remove the direct navigation in render
  if (people.length === 0) {
    return null;
  }

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="ml-2">Add Items</CardTitle>
          </div>
          <CardDescription>Add and manage items in your bill</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs defaultValue="receipt" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="receipt">Scan Receipt</TabsTrigger>

                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="receipt" className="space-y-4">
                <ReceiptScanner
                  isProcessing={isProcessing}
                  onFileUpload={handleFileUpload}
                />
              </TabsContent>
              <TabsContent value="manual" className="space-y-4">
                <ItemForm
                  people={people}
                  onAddOrUpdateItem={handleAddOrUpdateItem}
                  editingItem={
                    editingItemId
                      ? items.find((item) => item.id === editingItemId) || null
                      : null
                  }
                  onCancelEdit={cancelEdit}
                />
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Added Items List */}
            <div className="space-y-4">
              <h3 className="font-medium">Added Items</h3>
              <ItemList
                items={items}
                onEditItem={editItem}
                onRemoveItem={removeItem}
                editingItemId={editingItemId}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed position button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="container max-w-md mx-auto">
          <Button
            onClick={viewSummary}
            className="w-full"
            disabled={items.length === 0}
          >
            View Summary
          </Button>
        </div>
      </div>

      {/* Item Confirmation Dialog */}
      <ItemConfirmationDialog
        isOpen={isConfirmationDialogOpen}
        onClose={closeConfirmationDialog}
        extractedItems={extractedItems}
        currentItemIndex={currentItemIndex}
        selectedPeople={selectedPeople}
        people={people}
        onTogglePerson={togglePerson}
        onSelectAllPeople={selectAllPeople}
        onConfirm={confirmCurrentItem}
        onSkip={skipCurrentItem}
      />
    </main>
  );
}

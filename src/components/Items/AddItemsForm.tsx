"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateReactHelpers } from "@uploadthing/react";

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
import type { OurFileRouter } from "@/app/api/uploadthing/core";

import {
  ItemForm,
  ItemList,
  ReceiptScanner,
  ItemConfirmationDialog,
  type ExtractedItem,
} from "./";
import Link from "next/link";

// Generate the uploadthing helpers
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function AddItemsForm() {
  const { people, items, addItem, updateItem, removeItem } = useBillSplitter();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Receipt processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  // Setup uploadthing
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        try {
          // Call the server action to process the receipt
          const processedReceipt = await processReceipt(res[0].ufsUrl);

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
            `Failed to process receipt: Please try again or add items manually.`
          );
        } finally {
          setIsProcessing(false);
        }
      }
    },
    onUploadError: (error) => {
      toast.error(`Error uploading: ${error.message}`);
      setIsProcessing(false);
    },
  });

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

  // Receipt processing functions
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);

      // Compress image before uploading
      const compressedFile = await compressImage(files[0]);

      // Upload the compressed file using uploadthing
      const startTime = Date.now();
      await startUpload([compressedFile]);
      const executionTime = Date.now() - startTime;
      console.log(`handleFileUpload execution time: ${executionTime / 1000}s`);

      // The rest is handled in onClientUploadComplete callback
    } catch (error) {
      toast.error(
        `Failed to upload receipt: Please try again or add items manually.`
      );
      setIsProcessing(false);
    } finally {
      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  // Function to compress image before upload
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          // Create canvas
          const canvas = document.createElement("canvas");

          // Calculate new dimensions while maintaining aspect ratio
          let width = image.width;
          let height = image.height;
          const maxDimension = 1200; // Maximum dimension for either width or height

          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw resized image to canvas
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(image, 0, 0, width, height);

          // Convert to blob with reduced quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not create blob"));
                return;
              }

              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            0.95 // Compression quality (0-1)
          );
        };

        image.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        if (typeof readerEvent.target?.result === "string") {
          image.src = readerEvent.target.result;
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
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
          <Link href="/summary">
            <Button
              onClick={() => setIsLoading(true)}
              className="w-full"
              disabled={items.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "View Summary"
              )}
            </Button>
          </Link>
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

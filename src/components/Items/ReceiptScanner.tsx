import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ReceiptScannerProps {
  isProcessing: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function ReceiptScanner({
  isProcessing,
  onFileUpload,
}: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = [
    "Deciphering chicken scratch handwriting on receipt...",
    "Trying to figure out why you're paying this much for food...",
    "Struggling with your slow internet, but don't worry, it's almost done. Don't refresh...",
    "I dare you to refresh...",
  ];

  useEffect(() => {
    if (isProcessing) {
      setLoadingStep(0);

      const timeouts: NodeJS.Timeout[] = [];

      // Step 1 -> Step 2
      timeouts.push(
        setTimeout(() => {
          setLoadingStep(1);
        }, 5000)
      );

      // Step 2 -> Step 3
      timeouts.push(
        setTimeout(() => {
          setLoadingStep(2);
        }, 10000)
      );

      // Step 3 -> Step 4
      timeouts.push(
        setTimeout(() => {
          setLoadingStep(3);
        }, 15000)
      );

      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    }
  }, [isProcessing]);

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <h3 className="font-medium">Upload or Take a Photo of Receipt</h3>
      <p className="text-sm text-muted-foreground">
        We&apos;ll extract items from your receipt and help you assign them to
        people.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="h-24 flex flex-col items-center justify-center"
        >
          <Upload className="h-6 w-6 mb-2" />
          Upload Receipt
        </Button>

        <Button
          onClick={handleTakePhoto}
          disabled={isProcessing}
          className="h-24 flex flex-col items-center justify-center"
        >
          <Camera className="h-6 w-6 mb-2" />
          Take Photo
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
          capture="environment"
        />
      </div>

      {isProcessing && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center mb-2">
            <div
              className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full mr-1 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <p className="text-sm font-medium">{loadingMessages[loadingStep]}</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Home, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBillSplitter } from "@/contexts/bill-splitter-context";
import { SummaryOverview } from "./SummaryOverview";
import { PerPersonSummary } from "./PerPersonSummary";
import { PersonSummary } from "./types";

export function SummaryContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { people, vat, serviceCharge, items, calculateTotal, resetAll } =
    useBillSplitter();
  const [personSummaries, setPersonSummaries] = useState<
    Record<string, PersonSummary>
  >({});

  useEffect(() => {
    if (people.length === 0 || items.length === 0) {
      router.push("/");
      return;
    }

    // Calculate per person summaries
    const result: Record<string, PersonSummary> = {};

    // Initialize result for each person
    people.forEach((person) => {
      result[person] = { items: [], amount: 0 };
    });

    // Calculate each person's items and raw amount
    items.forEach((item) => {
      const perPersonCost = item.price / item.sharedBy.length;

      item.sharedBy.forEach((person) => {
        result[person].items.push(item);
        result[person].amount += perPersonCost;
      });
    });

    // Calculate total raw amount
    const rawTotal = Object.values(result).reduce(
      (sum, person) => sum + person.amount,
      0
    );

    // Calculate proportional service charge and VAT for each person
    const totals = calculateTotal();

    Object.keys(result).forEach((person) => {
      const proportion = result[person].amount / rawTotal;
      const personServiceCharge = totals.serviceChargeAmount * proportion;
      const personVat = totals.vatAmount * proportion;

      // Update amount to include service charge and VAT
      result[person].amount =
        result[person].amount + personServiceCharge + personVat;
    });

    setPersonSummaries(result);
  }, [people, items, vat, serviceCharge, calculateTotal, router]);

  const handleResetAndStartNew = () => {
    setIsLoading(true);
    resetAll();
    router.push("/");
  };

  if (people.length === 0 || items.length === 0) {
    return null; // Will redirect in useEffect
  }

  const totals = calculateTotal();

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/items")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="ml-2">Bill Summary</CardTitle>
          </div>
          <CardDescription>See what everyone owes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="perPerson">Per Person</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <SummaryOverview
                personSummaries={personSummaries}
                totals={totals}
                serviceCharge={serviceCharge}
                vat={vat}
              />
            </TabsContent>

            <TabsContent value="perPerson">
              <PerPersonSummary personSummaries={personSummaries} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Fixed position button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="container max-w-md mx-auto">
          <Button
            disabled={isLoading}
            onClick={handleResetAndStartNew}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Home className="h-4 w-4 mr-2" />
                Start New Bill
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

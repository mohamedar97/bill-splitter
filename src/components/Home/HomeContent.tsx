"use client";

import type React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBillSplitter } from "@/contexts/bill-splitter-context";
import { PeopleInput } from "./PeopleInput";
import { BillSettings } from "./BillSettings";

export function HomeContent() {
  const router = useRouter();
  const {
    people,
    vat,
    serviceCharge,
    addPerson,
    removePerson,
    updateVat,
    updateServiceCharge,
  } = useBillSplitter();

  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (people.length > 0) {
      router.push("/items");
    }
  };

  return (
    <main className="container max-w-md mx-auto p-4 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Split the Bill</CardTitle>
          <CardDescription>
            Enter who&apos;s splitting the bill and the charges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <BillSettings
              vat={vat}
              serviceCharge={serviceCharge}
              updateVat={updateVat}
              updateServiceCharge={updateServiceCharge}
            />

            <PeopleInput
              people={people}
              addPerson={addPerson}
              removePerson={removePerson}
            />
          </form>
        </CardContent>
      </Card>

      {/* Fixed position button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="container max-w-md mx-auto">
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full"
            disabled={people.length === 0}
          >
            Continue to Add Items
          </Button>
        </div>
      </div>
    </main>
  );
}

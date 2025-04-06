"use client";

import type React from "react";

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
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function HomeContent() {
  const [loading, setLoading] = useState(false);
  const {
    people,
    vat,
    serviceCharge,
    addPerson,
    removePerson,
    updateVat,
    updateServiceCharge,
  } = useBillSplitter();

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
          <Link href="/items">
            <Button
              type="button"
              className="w-full"
              onClick={() => setLoading(true)}
              disabled={people.length === 0 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Continue to Add Items"
              )}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

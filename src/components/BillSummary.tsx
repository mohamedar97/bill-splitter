import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderItem {
  id: string;
  price: number;
  assignedTo: string[];
}

interface Person {
  id: string;
  name: string;
}

interface BillSummaryProps {
  orderItems: OrderItem[];
  vat: number;
  serviceFee: number;
  people: Person[];
}

export function BillSummary({
  orderItems,
  vat,
  serviceFee,
  people,
}: BillSummaryProps) {
  // Calculate all values once
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const serviceFeeAmount = subtotal * (serviceFee / 100);
  const vatAmount = (subtotal + serviceFeeAmount) * (vat / 100);
  const finalTotal = subtotal + serviceFeeAmount + vatAmount;

  const calculatePersonTotal = (personId: string) => {
    const personItems = orderItems.filter(
      (item) =>
        item.assignedTo.includes(personId) || item.assignedTo.includes("Shared")
    );
    const personSubtotal = personItems.reduce((sum, item) => {
      const itemCost = item.assignedTo.includes("Shared")
        ? item.price / people.length
        : item.price / item.assignedTo.length;
      return sum + itemCost;
    }, 0);
    const personServiceFee = personSubtotal * (serviceFee / 100);
    const personVat = (personSubtotal + personServiceFee) * (vat / 100);
    return personSubtotal + personVat + personServiceFee;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 h-[40vh] overflow-y-auto pr-2">
          <div className="pt-2  space-y-2 bg-background sticky top-0">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Total</span>
              <span>EGP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>VAT ({vat}%)</span>
              <span>EGP {vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Service Fee ({serviceFee}%)</span>
              <span>EGP {serviceFeeAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 border-t space-y-2">
            {people.map((person) => (
              <div
                key={person.id}
                className="flex justify-between items-center"
              >
                <span className="min-w-0 break-words">{person.name}</span>
                <span className="text-right whitespace-nowrap">
                  EGP {calculatePersonTotal(person.id).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t bg-background sticky bottom-0">
            <div className="flex justify-between font-bold">
              <span>Final Total</span>
              <span>EGP {finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

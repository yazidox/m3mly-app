"use client";

import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface MarkInvoicePaidButtonProps {
  invoiceId: string;
  orderId: string;
}

export default function MarkInvoicePaidButton({
  invoiceId,
  orderId,
}: MarkInvoicePaidButtonProps) {
  return (
    <form action="/api/factory/mark-invoice-paid" method="POST">
      <input type="hidden" name="invoice_id" value={invoiceId} />
      <input type="hidden" name="order_id" value={orderId} />
      <Button variant="outline" size="sm" className="text-green-600">
        <DollarSign className="h-4 w-4 mr-2" />
        Mark Paid
      </Button>
    </form>
  );
}

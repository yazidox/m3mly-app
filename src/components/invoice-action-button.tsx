"use client";

import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface InvoiceActionButtonProps {
  invoiceId: string;
  orderId: string;
}

export default function InvoiceActionButton({
  invoiceId,
  orderId,
}: InvoiceActionButtonProps) {
  return (
    <form action="/api/factory/mark-invoice-paid" method="POST">
      <input type="hidden" name="invoice_id" value={invoiceId} />
      <input type="hidden" name="order_id" value={orderId} />
      <Button className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        <span>Mark as Paid</span>
      </Button>
    </form>
  );
}

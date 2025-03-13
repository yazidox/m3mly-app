"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { useState } from "react";

interface InvoicePdfModalProps {
  invoiceId: string;
  invoiceNumber: string;
  children?: React.ReactNode;
}

export default function InvoicePdfModal({
  invoiceId,
  invoiceNumber,
  children,
}: InvoicePdfModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    const iframe = document.getElementById(
      "invoice-pdf-iframe",
    ) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>View PDF</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Invoice #{invoiceNumber}</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <iframe
              id="invoice-pdf-iframe"
              src={`/factory-dashboard/invoices/${invoiceId}/pdf`}
              className="w-full h-full min-h-[70vh]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

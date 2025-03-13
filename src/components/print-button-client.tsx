"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonClientProps {
  children: ReactNode;
  invoiceId: string;
  invoiceNumber: string;
  className?: string;
}

export default function PrintButtonClient({
  children,
  invoiceId,
  invoiceNumber,
  className,
}: PrintButtonClientProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div onClick={handlePrint} className={className}>
      {children}
    </div>
  );
}

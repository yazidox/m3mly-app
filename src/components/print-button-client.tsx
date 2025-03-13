"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonClientProps {
  className?: string;
}

export default function PrintButtonClient({
  className,
}: PrintButtonClientProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 ${className || ""}`}
      onClick={handlePrint}
      type="button"
    >
      <Printer className="h-4 w-4" />
      <span>Print</span>
    </Button>
  );
}

"use client";

import { ReactNode } from "react";

interface PrintButtonProps {
  children: ReactNode;
}

export default function PrintButton({ children }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      {children}
    </button>
  );
}

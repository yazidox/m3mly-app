"use client";

import { ReactNode } from "react";
import { ButtonHTMLAttributes } from "react";

interface PrintButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export default function PrintButton({ 
  children, 
  className, 
  ...props 
}: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

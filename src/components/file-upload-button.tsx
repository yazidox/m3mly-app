"use client";

import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  inputId: string;
}

export default function FileUploadButton({ inputId }: FileUploadButtonProps) {
  const handleClick = () => {
    const input = document.getElementById(inputId);
    if (input) {
      input.click();
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick}>
      Browse Files
    </Button>
  );
}

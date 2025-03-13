"use client";

import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import FileUploadButton from './file-upload-button';

interface OrderRequestFormProps {
  product: any;
  userData: any;
  placeOrder: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export function OrderRequestForm({ product, userData, placeOrder }: OrderRequestFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsLoading(true);
    try {
      const result = await placeOrder(formData);
      if (result.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="p-4 bg-green-100 text-green-600 rounded-full">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
        <p className="text-muted-foreground max-w-md">
          Thank you for placing your order for {product.name}. Our team will review your order details and contact you shortly regarding the next steps.
        </p>
        <div className="mt-6 space-y-4">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 w-full"
          >
            View My Orders
          </Link>
          <Link
            href={`/factory/${product.factory_id}/products`}
            className="inline-flex items-center justify-center rounded-md bg-secondary px-8 py-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 w-full"
          >
            Browse More Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="product_id" value={product.id} />
      <input type="hidden" name="factory_id" value={product.factory_id} />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={userData?.full_name || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={userData?.email || ""}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={userData?.phone || ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" name="company" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shipping_address">Shipping Address</Label>
          <Textarea
            id="shipping_address"
            name="shipping_address"
            rows={3}
            defaultValue={userData?.address || ""}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Order Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={product.min_order_quantity}
              defaultValue={product.min_order_quantity}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" name="color" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Input id="size" name="size" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input id="material" name="material" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="design_files">Design Files</Label>
          <div className="border border-dashed border-border rounded-md p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your design files here, or click to browse
            </p>
            <Input
              id="design_files"
              name="design_files"
              type="file"
              className="hidden"
              multiple
            />
            <FileUploadButton inputId="design_files" />
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: AI, PSD, PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any specific requirements or instructions for your order"
            rows={4}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Place Order"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        By placing this order, you agree to our terms and conditions. A deposit may be required before production begins.
      </p>
    </form>
  );
} 
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "./ui/use-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface SampleRequestFormProps {
  product: any;
  userData: any;
  requestSample: (formData: FormData) => Promise<{ success: boolean; message: string }>;
}

export function SampleRequestForm({ product, userData, requestSample }: SampleRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await requestSample(formData);
      
      toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if (result.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="p-4 bg-green-100 text-green-600 rounded-full">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold">Sample Request Successful!</h2>
        <p className="text-muted-foreground max-w-md">
          Thank you for requesting a sample of {product.name}. Our team will review your request and get back to you shortly.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/samples"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View My Sample Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form id="sample-form" action={handleSubmit} className="space-y-6">
      <input type="hidden" name="product_id" value={product.id} />
      <input
        type="hidden"
        name="factory_id"
        value={product.factory_id}
      />

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

        <div className="space-y-2">
          <Label htmlFor="quantity">Sample Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            defaultValue="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any specific requirements or questions about the sample"
            rows={4}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Sample"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        By submitting this request, you agree to our terms and
        conditions. Sample fees may apply depending on the factory's
        policy.
      </p>
    </form>
  );
} 
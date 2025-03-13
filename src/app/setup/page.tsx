"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Factory, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setupFactoryOwner = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/setup/factory-owner");
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setCredentials(data.credentials);
      } else {
        setError(data.message || "Failed to set up factory owner account");
      }
    } catch (err) {
      console.error("Error setting up factory owner:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            M3mly Platform Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <Factory className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Create a demo factory owner account to test the platform
                </p>
              </div>

              <Button
                onClick={setupFactoryOwner}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Setting up..." : "Create Factory Owner Account"}
              </Button>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Setup Complete!</h3>
                <p className="text-muted-foreground">
                  Factory owner account has been created successfully.
                </p>
              </div>

              {credentials && (
                <div className="bg-muted p-4 rounded-md mb-6">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Factory Owner Credentials</span>
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {credentials.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Password:</span>{" "}
                      {credentials.password}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Link href="/sign-in" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Go to Sign In
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button className="w-full">Go to Homepage</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

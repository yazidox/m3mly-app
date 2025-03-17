import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import Navbar from "@/components/navbar";
import SignupForm from "@/components/auth/signup-form";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <SignupForm message={searchParams} />
        <SmtpMessage />
      </div>
    </>
  );
}

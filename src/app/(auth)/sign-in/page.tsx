import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SmtpMessage } from "../smtp-message";
import SignInForm from "@/components/auth/signin-form";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <SignInForm message={message} />
        <SmtpMessage />
      </div>
    </>
  );
}

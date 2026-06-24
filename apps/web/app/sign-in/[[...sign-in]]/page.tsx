import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { AuthShell, clerkAppearance } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue adapting your reading."
    >
      <SignIn
        appearance={clerkAppearance}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/app"
      />
      <p className="mt-6 text-center text-sm text-mist-500">
        New to Aptly?{" "}
        <Link href="/sign-up" className="font-medium text-ink hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

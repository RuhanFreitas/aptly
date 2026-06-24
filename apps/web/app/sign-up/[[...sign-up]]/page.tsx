import type { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { AuthShell, clerkAppearance } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start reshaping content around the way you think."
    >
      <SignUp
        appearance={clerkAppearance}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/app"
      />
      <p className="mt-6 text-center text-sm text-mist-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-ink hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

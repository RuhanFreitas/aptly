import type { Metadata } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/marketing/logo";

export const metadata: Metadata = {
  title: "Workspace",
  description: "Adapt your documents to the way you read.",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bone">
      <header className="sticky top-0 z-40 border-b border-mist-200 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Aptly home">
              <Logo />
            </Link>
            <span className="hidden h-5 w-px bg-mist-200 sm:block" />
            <span className="hidden text-sm text-mist-500 sm:block">
              Workspace
            </span>
          </div>
          <UserButton
            appearance={{ elements: { avatarBox: "size-8" } }}
            userProfileMode="modal"
          />
        </div>
      </header>
      {children}
    </div>
  );
}

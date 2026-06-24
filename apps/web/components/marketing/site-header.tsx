"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#mission", label: "Mission" },
  { href: "#dimensions", label: "Dimensions" },
  { href: "#how", label: "How it works" },
  { href: "#research", label: "Research" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-mist-200/80 bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" aria-label="Aptly home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-mist-600 transition-colors hover:bg-mist-100 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoaded && isSignedIn ? (
            <>
              <Link
                href="/app"
                className={buttonClasses({ variant: "primary", size: "sm" })}
              >
                Open app
                <ArrowRight className="size-4" />
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={buttonClasses({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={buttonClasses({ variant: "primary", size: "sm" })}
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-ink md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-mist-200 bg-paper px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-mist-700 hover:bg-mist-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-mist-200 pt-3">
            {isLoaded && isSignedIn ? (
              <Link
                href="/app"
                className={buttonClasses({ variant: "primary", size: "md" })}
              >
                Open app
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={buttonClasses({ variant: "outline", size: "md" })}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonClasses({ variant: "primary", size: "md" })}
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

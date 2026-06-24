import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Dimensions", href: "#dimensions" },
      { label: "How it works", href: "#how" },
      { label: "Open the app", href: "/app" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Mission", href: "#mission" },
      { label: "Research", href: "#research" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Get started", href: "/sign-up" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-mist-200 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist-500">
              A cognitive content adaptation platform. We make content easier to
              process, navigate and understand.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold tracking-tight">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-mist-500 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-mist-200 pt-6 text-sm text-mist-500 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Aptly. Content that adapts to people.</p>
          <p>Designed for calmer, more accessible reading.</p>
        </div>
      </div>
    </footer>
  );
}

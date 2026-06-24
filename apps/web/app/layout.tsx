import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aptly.app"),
  title: {
    default: "Aptly — Content that adapts to how you think",
    template: "%s · Aptly",
  },
  description:
    "Aptly is a cognitive content adaptation platform. Reshape dense documents around your reading needs — directness, detail, focus, comfort and more.",
  openGraph: {
    title: "Aptly — Content that adapts to how you think",
    description:
      "Reshape dense documents around your reading needs. Content should adapt to people, not the other way around.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0a0a0b",
          colorBackground: "#ffffff",
          borderRadius: "0.7rem",
          fontFamily: "var(--font-geist-sans)",
        },
      }}
    >
      <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <body className="min-h-screen bg-paper font-sans text-ink antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

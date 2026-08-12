import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { LiveChrome } from "@/components/live-chrome";
import { PrototypeShell } from "@/components/prototype/prototype-shell";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Serif display face for editorial headlines (Take B explores it; the
   winner's type system gets locked with the tokens in ticket 21). */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {process.env.NODE_ENV === "production" ? (
          <LiveChrome>{children}</LiveChrome>
        ) : (
          /* Dev-only prototype gate (ticket 21): the take switcher reads
             ?variant= client-side, so the shell sits under a Suspense
             boundary with the live chrome as the SSR fallback. */
          <Suspense fallback={<LiveChrome>{children}</LiveChrome>}>
            <PrototypeShell>{children}</PrototypeShell>
          </Suspense>
        )}
      </body>
    </html>
  );
}

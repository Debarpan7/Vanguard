import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * The live site chrome (header + main + footer) — also the Suspense
 * fallback for the prototype shell, so initial HTML and non-prototype
 * routes are byte-identical to the current site.
 */
export function LiveChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

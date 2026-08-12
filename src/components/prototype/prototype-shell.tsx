"use client";

import type { ComponentType, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LiveChrome } from "./live-chrome";
import { PrototypeSwitcher } from "./prototype-switcher";
import { TakeAShell } from "./take-a";
import { TakeBShell } from "./take-b";
import { TakeCShell } from "./take-c";
import {
  isPrototypeRoute,
  parseVariant,
  type PrototypeVariant,
} from "./variants";

const SHELLS: Record<PrototypeVariant, ComponentType<{ children: ReactNode }>> =
  {
    A: TakeAShell,
    B: TakeBShell,
    C: TakeCShell,
  };

/**
 * Client gate that swaps the site chrome (header + footer) for the selected
 * take's chrome on the prototype routes. Reads `?variant=` from the URL;
 * the take *content* is dispatched by the pages themselves. Development
 * only — in production builds this always renders the live chrome.
 */
export function PrototypeShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const take = parseVariant(searchParams.get("variant"));

  if (process.env.NODE_ENV === "production" || !isPrototypeRoute(pathname)) {
    return <LiveChrome>{children}</LiveChrome>;
  }

  const Shell = take === null ? LiveChrome : SHELLS[take];

  return (
    <>
      <Shell>{children}</Shell>
      <PrototypeSwitcher />
    </>
  );
}

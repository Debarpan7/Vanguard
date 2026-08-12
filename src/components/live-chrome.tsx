import type { ReactNode } from "react";
import { TakeBShell } from "@/components/prototype/take-b";

/**
 * The production site chrome. Take B is now the locked site-wide shell;
 * prototype switching remains development-only in PrototypeShell.
 */
export function LiveChrome({ children }: { children: ReactNode }) {
  return <TakeBShell>{children}</TakeBShell>;
}

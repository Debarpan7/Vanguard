/**
 * Prototype take (ticket 21 — design tokens & shell, HITL gate).
 *
 * Three structurally-different navy + gold takes on the home page and the
 * benchmarking view, switchable via `?variant=A|B|C`. The live site is the
 * default (no param). Everything in this directory is prototype code —
 * the winner is folded into the real shell after the user reacts; the
 * losers are thrown away (prototype skill, UI branch, sub-shape A).
 */

/** The three takes, in cycling order. `null` is the live site. */
export const PROTOTYPE_VARIANTS = ["A", "B", "C"] as const;
export type PrototypeVariant = (typeof PROTOTYPE_VARIANTS)[number];

/** Routes the takes cover. Other routes always render the live shell. */
export const PROTOTYPE_ROUTES = ["/", "/benchmarking"] as const;

export function isPrototypeRoute(pathname: string): boolean {
  return (PROTOTYPE_ROUTES as readonly string[]).includes(pathname);
}

export function parseVariant(
  value: string | string[] | undefined | null,
): PrototypeVariant | null {
  if (typeof value !== "string") return null;
  return (PROTOTYPE_VARIANTS as readonly string[]).includes(value)
    ? (value as PrototypeVariant)
    : null;
}

export const VARIANT_LABELS: Readonly<Record<PrototypeVariant, string>> = {
  A: "Take A — Classic institutional",
  B: "Take B — Deep navy editorial",
  C: "Take C — Gold-forward split",
};

/** Live-site label shown by the switcher when no take is active. */
export const LIVE_LABEL = "Live site";

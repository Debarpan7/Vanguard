"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  LIVE_LABEL,
  PROTOTYPE_ROUTES,
  PROTOTYPE_VARIANTS,
  VARIANT_LABELS,
  parseVariant,
  type PrototypeVariant,
} from "./variants";

/**
 * The floating variant switcher (prototype skill, UI branch, sub-shape A).
 *
 * Fixed bottom-center bar with ← arrow / label / → arrow, URL-param driven
 * via router.replace, ←/→ keyboard cycling (skipped when the focus is in an
 * input/textarea/contenteditable), visually distinct from the page, and
 * compiled out of production builds entirely (NODE_ENV gate).
 *
 * Only rendered on the take routes — every other route is untouched.
 */
export function PrototypeSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const enabled =
    process.env.NODE_ENV !== "production" &&
    (PROTOTYPE_ROUTES as readonly string[]).includes(pathname);

  const current = parseVariant(searchParams.get("variant"));

  const goTo = useCallback(
    (variant: PrototypeVariant | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (variant === null) next.delete("variant");
      else next.set("variant", variant);
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const cycle = useCallback(
    (direction: 1 | -1) => {
      const order: Array<PrototypeVariant | null> = [
        null,
        ...PROTOTYPE_VARIANTS,
      ];
      const index = order.indexOf(current);
      const next = order[(index + direction + order.length) % order.length];
      goTo(next);
    },
    [current, goTo],
  );

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        cycle(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        cycle(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cycle, enabled]);

  if (!enabled) return null;

  const label =
    current === null ? LIVE_LABEL : VARIANT_LABELS[current];

  return (
    <div
      aria-label="Design take switcher"
      role="group"
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4"
    >
      <div className="flex items-center gap-2 rounded-full border border-gold-500/40 bg-navy-900 px-2 py-1.5 shadow-lg shadow-black/40 ring-1 ring-black/10">
        <button
          type="button"
          onClick={() => cycle(-1)}
          aria-label="Previous take"
          className="rounded-full p-1.5 text-gold-300 transition-colors hover:bg-white/10 hover:text-gold-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <span className="min-w-44 text-center text-sm font-medium text-white">
          {label}
        </span>
        <button
          type="button"
          onClick={() => cycle(1)}
          aria-label="Next take"
          className="rounded-full p-1.5 text-gold-300 transition-colors hover:bg-white/10 hover:text-gold-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

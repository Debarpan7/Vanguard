"use client";

import { useState } from "react";

interface CopyLinkButtonProps {
  /** Site-relative href of the view, e.g. "/metrics#aum". */
  href: string;
  testId: string;
  label?: string;
}

/**
 * Client button that copies the absolute shareable URL for a view
 * (ticket 19). The URL is derived from the current origin plus the stable
 * href, so links keep working across deployments.
 */
export function CopyLinkButton({
  href,
  testId,
  label = "Copy link",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = `${window.location.origin}${href}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g., non-secure context) — leave the button
      // unchanged rather than failing silently.
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={handleClick}
      className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

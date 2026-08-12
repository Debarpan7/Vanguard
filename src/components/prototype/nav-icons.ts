import {
  ArrowLeftRight,
  Gauge,
  GitBranch,
  Info,
  MessageSquare,
  Package,
  Scale,
  type LucideIcon,
} from "lucide-react";

/**
 * Colored section icons for the header nav (ticket 21 checklist item 2).
 * Keyed by nav link path; every section gets one.
 */
export const navIcons: Readonly<Record<string, LucideIcon>> = {
  "/metrics": Gauge,
  "/products": Package,
  "/benchmarking": Scale,
  "/roe-tree": GitBranch,
  "/roe-comparison": ArrowLeftRight,
  "/chatbot": MessageSquare,
  "/about": Info,
};

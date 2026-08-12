import { TakeAHome } from "@/components/prototype/take-a";
import { TakeBHome } from "@/components/prototype/take-b";
import { TakeCHome } from "@/components/prototype/take-c";
import { parseVariant } from "@/components/prototype/variants";

/**
 * Ticket 21 — design tokens & shell (HITL gate): home + benchmarking get
 * three structurally different prototype takes, switchable via `?variant=`.
 * Dev-only; production always renders the live page.
 */
export default async function Home({ searchParams }: PageProps<"/">) {
  const { variant } = await searchParams;
  const take = process.env.NODE_ENV === "production" ? null : parseVariant(variant);

  if (take === "A") return <TakeAHome />;
  if (take === "B") return <TakeBHome />;
  if (take === "C") return <TakeCHome />;
  return <TakeBHome />;
}

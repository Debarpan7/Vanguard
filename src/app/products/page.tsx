import { ProductCatalog } from "@/components/product-catalog";
import { DataAsOfMarker } from "@/components/data-as-of-marker";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Products &amp; services
        </h1>
        <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          A catalog of Vanguard&apos;s products and services, organized by the
          site taxonomy — funds, ETFs, retirement, brokerage, advice,
          institutional. Content is populated from public sources, with the
          source shown for every item.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Data-as-of: <DataAsOfMarker />
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Catalog depth is seed-level: the line-of-business depth decision
          (ticket 07) and richer catalog data from the analysis pipeline
          (ticket 17) will expand these pages.
        </p>
      </header>
      <ProductCatalog />
    </div>
  );
}

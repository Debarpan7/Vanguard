import { productCategories } from "@/data/product-catalog";
import { formatAsOf } from "@/lib/format";
import { SurfaceCard } from "@/components/surface";

/**
 * The products & services catalog — renders the six ticket-13 categories in
 * taxonomy order from the catalog dataset (src/data/product-catalog.ts),
 * with the source shown for every item. Server component: no client state,
 * no search (cross-view search is ticket 19's extension, not ticket 13).
 */

export function ProductCatalog() {
  return (
    <div className="mt-10 space-y-8" data-testid="product-catalog">
      {productCategories.map((category) => (
        <SurfaceCard
          key={category.id}
          data-testid={`product-category-${category.id}`}
          className="p-6"
        >
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            {category.name}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {category.blurb}
          </p>
          <ul className="mt-4 divide-y divide-navy-100 dark:divide-navy-800">
            {category.items.map((item, index) => (
              <li
                key={item.name}
                data-testid={`product-item-${category.id}-${index}`}
                className="py-4 first:pt-0 last:pb-0"
              >
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </p>
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Source:{" "}
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500"
                  >
                    {item.source}
                  </a>
                  {item.asOf ? ` (as of ${formatAsOf(item.asOf)})` : null}
                </p>
                {item.note ? (
                  <p className="mt-1 text-xs italic text-zinc-500 dark:text-zinc-400">
                    {item.note}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </SurfaceCard>
      ))}
    </div>
  );
}

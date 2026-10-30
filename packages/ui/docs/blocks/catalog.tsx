import type { ReactNode } from "react";
import { Toaster } from "@koperty/ui/primitives/toast";
import type { CatalogEntry } from "./catalog-data";

// Blocks for the "Design system" pages (documentation only). Links go to the docs page of an entry
// in the Storybook manager (the docs page itself runs in an iframe).

export function DocsLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a href={`./?path=/docs/${id}`} target="_top" className="text-link underline">
      {children}
    </a>
  );
}

const GROUP_TITLES = ["Komponenty bazowe", "Komponenty produktu", "Wzorce"] as const;

/** Texts come from the MDX pages: `code` parts become <code>. */
function Rich({ text }: { text: string }) {
  return text.split("`").map((part, index) => (index % 2 ? <code key={part}>{part}</code> : part));
}

/** "Komponenty": a small preview, group, one sentence and a link for every entry. */
export function ComponentCatalog({ entries }: { entries: CatalogEntry[] }) {
  return (
    // sb-unstyled: Storybook docs typography doesn't apply, so the components look as in the product.
    <div className="sb-unstyled flex flex-col gap-section font-sans">
      {GROUP_TITLES.map((group, index) => (
        <section
          key={group}
          aria-labelledby={`catalog-${index}`}
          className="flex flex-col gap-group"
        >
          <h2 id={`catalog-${index}`} className="text-section text-default">
            {group}
          </h2>
          <ul className="grid gap-between-groups md:grid-cols-2">
            {entries
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <li
                  key={entry.name}
                  className="flex min-w-0 flex-col gap-group rounded-card border border-subtle bg-surface-card p-panel shadow-card"
                >
                  <div className="flex min-h-control min-w-0 flex-wrap items-center gap-group">
                    {entry.preview === "live" ? (
                      entry.node
                    ) : (
                      // The real component, not interactive: too large for a card.
                      <div inert className="catalog-static w-full">
                        {entry.node}
                      </div>
                    )}
                  </div>
                  <h3 className="text-label text-default">
                    <DocsLink id={entry.docsId}>{entry.name}</DocsLink>
                  </h3>
                  <p className="text-meta text-muted">
                    {entry.epic ? `${entry.group} · ${entry.epic}` : entry.group}
                    {entry.preview === "static" && " · podgląd statyczny"}
                  </p>
                  <p className="text-body text-default">
                    <Rich text={entry.description} />
                  </p>
                </li>
              ))}
          </ul>
        </section>
      ))}
      <Toaster />
    </div>
  );
}

/** "Zacznij tutaj": name, import, when to use, when not – for every entry. */
export function ComponentTable({ entries }: { entries: CatalogEntry[] }) {
  return (
    <div className="sb-unstyled flex flex-col gap-between-groups font-sans">
      {GROUP_TITLES.map((group, index) => (
        <section key={group} aria-labelledby={`table-${index}`} className="flex flex-col gap-group">
          <h3 id={`table-${index}`} className="text-label text-default">
            {group}
          </h3>
          <dl className="flex flex-col">
            {entries
              .filter((entry) => entry.group === group)
              .map((entry) => (
                <div
                  key={entry.name}
                  className="flex min-w-0 flex-col gap-inline border-b border-subtle py-group"
                >
                  <dt className="text-label text-default">
                    <DocsLink id={entry.docsId}>{entry.name}</DocsLink>
                  </dt>
                  <dd className="min-w-0 text-meta text-muted wrap-anywhere">
                    <code>{`import { ${entry.exports} } from "${entry.importPath}";`}</code>
                  </dd>
                  <dd className="text-body text-default">
                    Kiedy: <Rich text={entry.when} />
                  </dd>
                  <dd className="text-body text-muted">
                    Kiedy nie: <Rich text={entry.whenNot} />
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

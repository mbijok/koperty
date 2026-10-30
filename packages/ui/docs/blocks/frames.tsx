import type { ReactNode } from "react";

// Documentation-only layout helpers for stories. Not exported from the package.

export type StateCell = { label: string; node: ReactNode };

/** One labelled cell per state, e.g. default, hover, focus, pressed, disabled, loading. */
export function StateGrid({ title, states }: { title?: string; states: StateCell[] }) {
  return (
    <section className="flex flex-col gap-group">
      {title && <p className="text-label text-default">{title}</p>}
      <div className="flex flex-wrap items-end gap-between-groups">
        {states.map((state) => (
          <div key={state.label} className="flex max-w-full flex-col gap-inline">
            <span className="text-meta text-muted">{state.label}</span>
            {state.node}
          </div>
        ))}
      </div>
    </section>
  );
}

/** The narrowest supported screen (DS-S02, WCAG 1.4.10): 320 px including the page gutter. */
export function NarrowScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-inline">
      <span className="text-meta text-muted">Szerokość 320 px</span>
      <div
        className="max-w-full border border-subtle bg-surface-page px-gutter py-panel"
        style={{ width: "20rem" }}
      >
        {children}
      </div>
    </div>
  );
}

type Example = { node: ReactNode; note: string };

/** A "do / don't" pair for the documentation; the verdict is in text and icon, not only colour. */
export function DoDont({ good, bad }: { good: Example; bad: Example }) {
  return (
    <div className="grid gap-between-groups md:grid-cols-2">
      {[
        { verdict: "Dobrze", ...good },
        { verdict: "Źle", ...bad },
      ].map(({ verdict, node, note }) => (
        <figure
          key={verdict}
          className="flex min-w-0 flex-col gap-group rounded-card border border-subtle p-panel"
        >
          <div className="flex min-h-control min-w-0 flex-wrap items-center gap-group">{node}</div>
          <figcaption className="text-body text-default">
            <strong className="text-label">{verdict}:</strong> {note}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

import type { ReactNode } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { CONTRAST_THRESHOLD, contrastRatio, formatRatio, parseSrgb } from "./contrast";
import type { ContrastPair, TokenRow } from "./foundations-data";

// Documentation-only blocks for the Foundations pages. They read the real CSS variables, so the
// pages show exactly what the tokens resolve to. Not exported from the package; Storybook renders
// them only in the browser, so reading computed styles during render is safe here.

const SCHEMES = [
  { scheme: "light", label: "jasny", className: "scheme-light bg-surface-page" },
  { scheme: "dark", label: "ciemny", className: "scheme-dark bg-surface-page" },
] as const;

type Scheme = (typeof SCHEMES)[number]["scheme"];

// Resolves a pair of tokens in the given colour scheme with a temporary, invisible element.
function measureContrast(pair: ContrastPair, scheme: Scheme): number {
  const probe = document.createElement("span");
  probe.style.colorScheme = scheme;
  probe.style.color = `color-mix(in srgb, var(--${pair.fg}) 100%, transparent)`;
  probe.style.backgroundColor = `color-mix(in srgb, var(--${pair.bg}) 100%, transparent)`;
  document.body.append(probe);
  const style = getComputedStyle(probe);
  const ratio = contrastRatio(parseSrgb(style.color), parseSrgb(style.backgroundColor));
  probe.remove();
  return ratio;
}

function readToken(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim();
}

function DocTable({
  caption,
  head,
  children,
}: {
  caption: string;
  head: string[];
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full border-collapse text-left text-body">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-subtle text-label">
            {head.map((label) => (
              <th key={label} scope="col" className="p-group">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function ColorRoles({ roles }: { roles: TokenRow[] }) {
  return (
    <DocTable caption="Role kolorów" head={["Token", "Przeznaczenie", "Jasny", "Ciemny", "Źródło"]}>
      {roles.map((role) => (
        <tr key={role.token} className="border-b border-subtle">
          <td className="p-group font-mono">{role.token}</td>
          <td className="p-group">{role.purpose}</td>
          {SCHEMES.map(({ scheme, label, className }) => (
            <td
              key={scheme}
              aria-label={`Próbka ${role.token}, motyw ${label}`}
              className={`p-group ${className}`}
            >
              <span
                aria-hidden="true"
                className="block h-control w-full rounded-control border border-subtle"
                style={{ backgroundColor: `var(--${role.token})` }}
              />
            </td>
          ))}
          <td className="p-group text-muted">{role.source}</td>
        </tr>
      ))}
    </DocTable>
  );
}

function MeasuredContrast({
  pair,
  scheme,
  className,
}: {
  pair: ContrastPair;
  scheme: Scheme;
  className: string;
}) {
  const ratio = measureContrast(pair, scheme);
  const passes = ratio >= CONTRAST_THRESHOLD[pair.kind];
  const Icon = passes ? CircleCheck : TriangleAlert;
  const fg = `var(--${pair.fg})`;
  const bg = `var(--${pair.bg})`;

  return (
    <td className={`p-group ${className}`}>
      <span className="flex items-center gap-group">
        {pair.kind === "text" ? (
          <span
            className="inline-flex h-control items-center rounded-control px-control-x"
            style={{ color: fg, backgroundColor: bg }}
          >
            Aa 1 234,56 zł
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex size-control rounded-control p-inline"
            style={{ backgroundColor: bg }}
          >
            <span
              className="block size-full rounded-control"
              style={{ border: `var(--focus-width) solid ${fg}` }}
            />
          </span>
        )}
        <span className="flex items-center gap-inline text-default">
          <Icon aria-hidden="true" className="size-icon" />
          <span className="whitespace-nowrap">
            {formatRatio(ratio)}
            <span className="sr-only">{passes ? ", spełnia próg" : ", poniżej progu"}</span>
          </span>
        </span>
      </span>
    </td>
  );
}

export function ContrastTable({ pairs }: { pairs: ContrastPair[] }) {
  return (
    <DocTable
      caption="Kontrast par kolorów w obu motywach"
      head={["Para (tekst lub granica / tło)", "Zastosowanie", "Próg", "Jasny", "Ciemny"]}
    >
      {pairs.map((pair) => (
        <tr key={`${pair.fg}/${pair.bg}`} className="border-b border-subtle">
          <td className="p-group font-mono">
            {pair.fg} / {pair.bg}
          </td>
          <td className="p-group">{pair.use}</td>
          <td className="p-group whitespace-nowrap">
            {formatRatio(CONTRAST_THRESHOLD[pair.kind])}
            <span className="block text-meta text-muted">
              {pair.kind === "text" ? "WCAG 1.4.3" : "WCAG 1.4.11"}
            </span>
          </td>
          {SCHEMES.map(({ scheme, className }) => (
            <MeasuredContrast key={scheme} pair={pair} scheme={scheme} className={className} />
          ))}
        </tr>
      ))}
    </DocTable>
  );
}

export function TokenTable({
  caption,
  rows,
  preview,
}: {
  caption: string;
  rows: TokenRow[];
  preview?: (row: TokenRow) => ReactNode;
}) {
  return (
    <DocTable
      caption={caption}
      head={["Token", "Klasa", "Wartość", "Przeznaczenie", "Podgląd", "Źródło"]}
    >
      {rows.map((row) => (
        <tr key={row.token} className="border-b border-subtle align-middle">
          <td className="p-group font-mono">{row.token}</td>
          <td className="p-group font-mono">{row.className}</td>
          <td className="p-group">
            <code className="font-mono text-meta text-muted">{readToken(row.token)}</code>
          </td>
          <td className="p-group">{row.purpose}</td>
          <td className="p-group">{preview?.(row)}</td>
          <td className="p-group text-muted">{row.source}</td>
        </tr>
      ))}
    </DocTable>
  );
}

export function TypeSpecimen({ roles }: { roles: TokenRow[] }) {
  return (
    <div className="flex flex-col gap-between-groups">
      {roles.map((role) => (
        <div key={role.token} className="flex flex-col gap-inline border-b border-subtle pb-group">
          <span className={role.className}>
            {role.token.startsWith("type-amount")
              ? "−1 250,50 zł"
              : "Jedzenie: zostało na ten miesiąc"}
          </span>
          <span className="text-meta text-muted">
            {role.purpose} · <code className="font-mono">{role.className}</code> · {role.source}
          </span>
        </div>
      ))}
    </div>
  );
}

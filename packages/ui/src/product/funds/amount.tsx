import { cn } from "@koperty/ui/lib/utils";
import { formatPLN } from "@koperty/ui/lib/money";
import { Badge } from "@koperty/ui/primitives/badge";

type AmountProps = {
  /** Integer grosze (ADR 0004). */
  amount: number;
  /** balance: a negative value gets the minus sign and "Debet" (K3); income: "+" (P7); expense: plain. */
  kind?: "balance" | "income" | "expense";
  size?: "default" | "lg";
  className?: string;
};

// No colour for amounts, positive or negative (W4); tabular digits come from Oxanium (W3).
function Amount({ amount, kind = "balance", size = "default", className }: AmountProps) {
  const debit = kind === "balance" && amount < 0;
  const text = kind === "income" ? `+${formatPLN(amount)}` : formatPLN(amount);
  return (
    <span
      data-slot="amount"
      className={cn("inline-flex flex-wrap items-center gap-inline", className)}
    >
      <span
        className={cn(
          "whitespace-nowrap text-default",
          size === "lg" ? "text-amount-lg" : "text-amount",
        )}
      >
        {text}
      </span>
      {debit && <Badge>Debet</Badge>}
    </span>
  );
}

export { Amount, type AmountProps };

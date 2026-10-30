import { useId } from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatAmountInput, formatPLN } from "@koperty/ui/lib/money";
import { remainingToSplit, splitEvenly } from "@koperty/ui/lib/split";
import { Button } from "@koperty/ui/primitives/button";
import { FormField } from "@koperty/ui/primitives/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@koperty/ui/primitives/select";
import { AmountInput } from "@koperty/ui/product/funds/amount-input";

type SplitPart = { id: string; envelopeId: string; amount: string };
type EnvelopeOption = { id: string; name: string };
type PartErrors = { envelope?: string; amount?: string };

type SplitEditorProps = {
  /** The expense amount in grosze, or null while it is not a valid amount. */
  total: number | null;
  parts: SplitPart[];
  /** Active envelopes only – archived ones can't take expenses (US-13). */
  envelopes: EnvelopeOption[];
  onPartsChange: (parts: SplitPart[]) => void;
  /** Errors per part id, e.g. from validation on submit. */
  errors?: Record<string, PartErrors>;
  /** Id for a new part; defaults to a random UUID. */
  createPartId?: () => string;
};

const NO_ERRORS: Record<string, PartErrors> = {};

function randomPartId() {
  return crypto.randomUUID();
}

function summary(total: number | null, remaining: number): string {
  if (total === null) return "Wpisz kwotę wydatku, żeby zobaczyć, ile zostało do podziału.";
  if (remaining > 0) return `Do podziału: ${formatPLN(remaining)}`;
  if (remaining < 0) return `Części przekraczają kwotę wydatku o ${formatPLN(-remaining)}`;
  return "Podzielono całą kwotę.";
}

// Suggests, the database decides: the sum of parts must equal the expense (PRD 4.6, US-18).
function SplitEditor({
  total,
  parts,
  envelopes,
  onPartsChange,
  errors = NO_ERRORS,
  createPartId = randomPartId,
}: SplitEditorProps) {
  const hintId = useId();
  const remaining =
    total === null
      ? 0
      : remainingToSplit(
          total,
          parts.map((part) => part.amount),
        );

  function update(id: string, change: Partial<SplitPart>) {
    onPartsChange(parts.map((part) => (part.id === id ? { ...part, ...change } : part)));
  }

  // Available only once the expense has a valid amount (E2-Q1: the reason is shown below the button).
  const splitEqually =
    total === null
      ? undefined
      : () =>
          onPartsChange(
            splitEvenly(total, parts).map(([part, amount]) => ({
              id: part.id,
              envelopeId: part.envelopeId,
              amount: formatAmountInput(amount),
            })),
          );

  return (
    <fieldset data-slot="split-editor" className="flex flex-col gap-between-groups">
      <legend className="mb-group text-label text-default">Podział wydatku</legend>
      {parts.map((part, index) => {
        const taken = new Set(
          parts.filter((other) => other.id !== part.id).map((other) => other.envelopeId),
        );
        const partErrors = errors[part.id] ?? {};
        const number = index + 1;
        return (
          // A legend names its fieldset only as the first child; next to the delete button it can't be.
          <fieldset
            key={part.id}
            aria-labelledby={`${hintId}-${part.id}`}
            className="flex flex-col gap-group rounded-card border border-subtle p-panel-compact"
          >
            <div className="flex items-center justify-between gap-group">
              <span id={`${hintId}-${part.id}`} className="text-label text-muted">
                Część {number}
              </span>
              {parts.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Usuń część ${number}`}
                  onClick={() => onPartsChange(parts.filter((other) => other.id !== part.id))}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              )}
            </div>
            <div className="grid gap-group md:grid-cols-2">
              <FormField label="Koperta" error={partErrors.envelope}>
                {(control) => (
                  <Select
                    value={part.envelopeId}
                    onValueChange={(envelopeId) => update(part.id, { envelopeId })}
                  >
                    <SelectTrigger {...control}>
                      <SelectValue placeholder="Wybierz kopertę" />
                    </SelectTrigger>
                    <SelectContent>
                      {envelopes.map((envelope) => (
                        <SelectItem
                          key={envelope.id}
                          value={envelope.id}
                          disabled={taken.has(envelope.id)}
                        >
                          {envelope.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
              <FormField label="Kwota" hint="W złotych" error={partErrors.amount}>
                {(control) => (
                  <AmountInput
                    {...control}
                    value={part.amount}
                    onValueChange={(amount) => update(part.id, { amount })}
                  />
                )}
              </FormField>
            </div>
          </fieldset>
        );
      })}
      <output aria-live="polite" className="text-label text-default">
        {summary(total, remaining)}
      </output>
      <div className="flex flex-col gap-group md:flex-row">
        <Button
          variant="secondary"
          onClick={() =>
            onPartsChange([...parts, { id: createPartId(), envelopeId: "", amount: "" }])
          }
        >
          <Plus aria-hidden="true" />
          Dodaj część
        </Button>
        <Button
          variant="secondary"
          disabled={!splitEqually}
          aria-describedby={splitEqually ? undefined : hintId}
          onClick={splitEqually}
        >
          Podziel po równo
        </Button>
      </div>
      {!splitEqually && (
        <p id={hintId} className="text-meta text-muted">
          Podział po równo zadziała, gdy wpiszesz kwotę wydatku.
        </p>
      )}
    </fieldset>
  );
}

export { SplitEditor, type EnvelopeOption, type SplitEditorProps, type SplitPart };

import { useEffect, useRef, useState } from "react";
import { todayInWarsaw } from "@koperty/ui/lib/dates";
import { parsePLN } from "@koperty/ui/lib/money";
import { remainingToSplit } from "@koperty/ui/lib/split";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";
import { FieldGroup, FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@koperty/ui/primitives/select";
import { Switch } from "@koperty/ui/primitives/switch";
import {
  useFormSubmit,
  type FieldErrors,
  type SubmitResult,
} from "@koperty/ui/patterns/use-form-submit";
import {
  SplitEditor,
  type EnvelopeOption,
  type SplitPart,
} from "@koperty/ui/product/expenses/split-editor";
import { AmountInput } from "@koperty/ui/product/funds/amount-input";

/** Fields of the form; each split part has its own envelope and amount field. */
type ExpenseField =
  | "amount"
  | "envelope"
  | "date"
  | "description"
  | "split"
  | `${string}.envelope`
  | `${string}.amount`;

type ExpenseValues = {
  amount: number;
  date: string;
  description: string;
  /** One part without a split; the parts add up to the amount (PRD 4.6). */
  parts: { envelopeId: string; amount: number }[];
};

type ExpenseInitial = {
  amount?: string;
  date?: string;
  description?: string;
  parts?: { envelopeId: string; amount: string }[];
};

type ExpenseFormProps = {
  /** Active envelopes only – archived ones can't take expenses (US-13). */
  envelopes: EnvelopeOption[];
  /** Values of an expense being edited (US-19); a new expense starts with today's date (US-17). */
  initial?: ExpenseInitial;
  /** Calls create_expense / update_expense; maps SPLITS_INVALID, ENVELOPE_ARCHIVED… (error contract). */
  submit: (values: ExpenseValues) => Promise<SubmitResult<ExpenseField>>;
  onSuccess: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  /** Focus the amount when the screen opens (E3-Q4); off in documentation with many forms. */
  focusAmountOnOpen?: boolean;
  /** Id for a new split part; defaults to a random UUID. */
  createPartId?: () => string;
};

const NEW_EXPENSE: ExpenseInitial = {};
const PART_AMOUNT_ERROR = "Podaj kwotę części większą od zera.";

function randomPartId() {
  return crypto.randomUUID();
}

// The expense form (US-17, US-18, E3-Q4): amount first, then the envelope or a split into several.
function ExpenseForm({
  envelopes,
  initial = NEW_EXPENSE,
  submit,
  onSuccess,
  onCancel,
  submitLabel = "Zapisz wydatek",
  focusAmountOnOpen = false,
  createPartId = randomPartId,
}: ExpenseFormProps) {
  const initialParts = initial.parts ?? [];
  const [amount, setAmount] = useState(initial.amount ?? "");
  const [envelopeId, setEnvelopeId] = useState(initialParts[0]?.envelopeId ?? "");
  const [date, setDate] = useState(initial.date ?? todayInWarsaw());
  const [description, setDescription] = useState(initial.description ?? "");
  const [split, setSplit] = useState(initialParts.length > 1);
  const [parts, setParts] = useState<SplitPart[]>(() =>
    initialParts.map((part) => ({
      id: createPartId(),
      envelopeId: part.envelopeId,
      amount: part.amount,
    })),
  );
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusAmountOnOpen) amountRef.current?.focus();
  }, [focusAmountOnOpen]);

  const total = parsePLN(amount);

  function toggleSplit(on: boolean) {
    setSplit(on);
    if (on) {
      setParts([
        { id: createPartId(), envelopeId, amount: "" },
        { id: createPartId(), envelopeId: "", amount: "" },
      ]);
    } else {
      // Back to one envelope: the first one chosen in the split.
      setEnvelopeId(parts.map((part) => part.envelopeId).find(Boolean) ?? "");
    }
  }

  function validate(): FieldErrors<ExpenseField> {
    const errors: FieldErrors<ExpenseField> = {
      amount:
        total === null
          ? "Podaj kwotę, np. 120,50."
          : total === 0
            ? "Podaj kwotę większą od zera."
            : undefined,
      date: date ? undefined : "Podaj datę wydatku.",
    };
    if (!split) {
      errors.envelope = envelopeId ? undefined : "Wybierz kopertę.";
      return errors;
    }
    for (const part of parts) {
      errors[`${part.id}.envelope`] = part.envelopeId ? undefined : "Wybierz kopertę.";
      errors[`${part.id}.amount`] = parsePLN(part.amount) ? undefined : PART_AMOUNT_ERROR;
    }
    const remaining = remainingToSplit(
      Number(total),
      parts.map((part) => part.amount),
    );
    errors.split = total && remaining !== 0 ? "Części muszą dać razem kwotę wydatku." : undefined;
    return errors;
  }

  const form = useFormSubmit<ExpenseField>({
    validate,
    // submit runs only after validate() passed, so the amounts parse; Number() only narrows the type.
    submit: () =>
      submit({
        amount: Number(total),
        date,
        description: description.trim(),
        parts: split
          ? parts.map((part) => ({
              envelopeId: part.envelopeId,
              amount: Number(parsePLN(part.amount)),
            }))
          : [{ envelopeId, amount: Number(total) }],
      }),
    onSuccess,
  });

  const partErrors = Object.fromEntries(
    parts.map((part) => [
      part.id,
      {
        envelope: form.fieldErrors[`${part.id}.envelope`],
        amount: form.fieldErrors[`${part.id}.amount`],
      },
    ]),
  );

  return (
    <form noValidate onSubmit={form.onSubmit} className="flex flex-col gap-between-groups">
      <FieldGroup>
        <FormField label="Kwota" hint="W złotych, np. 120,50" error={form.fieldErrors.amount}>
          {(control) => (
            <AmountInput
              {...control}
              ref={amountRef}
              value={amount}
              onValueChange={setAmount}
              onBlur={() => form.validateField("amount")}
            />
          )}
        </FormField>
        {!split && (
          <FormField label="Koperta" error={form.fieldErrors.envelope}>
            {(control) => (
              <Select value={envelopeId} onValueChange={setEnvelopeId}>
                <SelectTrigger {...control}>
                  <SelectValue placeholder="Wybierz kopertę" />
                </SelectTrigger>
                <SelectContent>
                  {envelopes.map((envelope) => (
                    <SelectItem key={envelope.id} value={envelope.id}>
                      {envelope.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormField>
        )}
        <FormField
          label="Podziel wydatek na kilka kopert"
          hint="Np. jeden paragon za jedzenie i chemię."
          orientation="horizontal"
        >
          {(control) => <Switch {...control} checked={split} onCheckedChange={toggleSplit} />}
        </FormField>
        {split && (
          <SplitEditor
            total={total}
            parts={parts}
            envelopes={envelopes}
            onPartsChange={setParts}
            errors={partErrors}
            createPartId={createPartId}
          />
        )}
        {form.fieldErrors.split && (
          <Alert variant="danger">
            <AlertTitle>{form.fieldErrors.split}</AlertTitle>
          </Alert>
        )}
        <FormField label="Data" error={form.fieldErrors.date}>
          {(control) => (
            <Input
              {...control}
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              onBlur={() => form.validateField("date")}
            />
          )}
        </FormField>
        <FormField label="Opis" hint="Np. Biedronka, paliwo, apteka" optional>
          {(control) => (
            <Input
              {...control}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          )}
        </FormField>
      </FieldGroup>
      {form.formError && (
        <Alert variant="danger">
          <AlertTitle>{form.formError}</AlertTitle>
        </Alert>
      )}
      <div className="flex flex-col gap-group md:flex-row">
        <Button
          type="submit"
          loading={form.submitting}
          loadingText="Zapisywanie…"
          className="w-full md:w-auto"
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="w-full md:w-auto">
            Anuluj
          </Button>
        )}
      </div>
    </form>
  );
}

export { ExpenseForm, type ExpenseFormProps, type ExpenseValues };

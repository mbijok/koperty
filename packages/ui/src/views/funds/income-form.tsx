import { useState } from "react";
import { todayInWarsaw } from "@koperty/ui/lib/dates";
import { parsePLN } from "@koperty/ui/lib/money";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";
import { FieldGroup, FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";
import {
  useFormSubmit,
  type FieldErrors,
  type SubmitResult,
} from "@koperty/ui/patterns/use-form-submit";
import { AmountInput } from "@koperty/ui/product/funds/amount-input";

type IncomeField = "amount" | "date" | "description";
type IncomeValues = { amount: number; date: string; description: string };
type IncomeInitial = { amount?: string; date?: string; description?: string };

const NEW_INCOME: IncomeInitial = {};

type IncomeFormProps = {
  /** Values of an income being edited (US-15); a new income starts with today's date. */
  initial?: IncomeInitial;
  /** Calls create_income / update_income; maps business errors to fields (architecture, error contract). */
  submit: (values: IncomeValues) => Promise<SubmitResult<IncomeField>>;
  onSuccess: () => void;
  onCancel?: () => void;
  submitLabel?: string;
};

// The reference form of the design system (Wzorce / Formularz): an income has an amount, a date and an
// optional description (PRD 4.7, US-14).
function IncomeForm({
  initial = NEW_INCOME,
  submit,
  onSuccess,
  onCancel,
  submitLabel = "Zapisz przychód",
}: IncomeFormProps) {
  const [amount, setAmount] = useState(initial.amount ?? "");
  const [date, setDate] = useState(initial.date ?? todayInWarsaw());
  const [description, setDescription] = useState(initial.description ?? "");

  function validate(): FieldErrors<IncomeField> {
    const grosze = parsePLN(amount);
    return {
      amount:
        grosze === null
          ? "Podaj kwotę, np. 5000 albo 120,50."
          : grosze === 0
            ? "Podaj kwotę większą od zera."
            : undefined,
      date: date ? undefined : "Podaj datę przychodu.",
    };
  }

  const form = useFormSubmit<IncomeField>({
    validate,
    // submit runs only after validate() passed, so the amount parses; Number() only narrows the type.
    submit: () =>
      submit({ amount: Number(parsePLN(amount)), date, description: description.trim() }),
    onSuccess,
  });

  return (
    <form noValidate onSubmit={form.onSubmit} className="flex flex-col gap-between-groups">
      <FieldGroup>
        <FormField
          label="Kwota"
          hint="W złotych, np. 5000 albo 120,50"
          error={form.fieldErrors.amount}
        >
          {(control) => (
            <AmountInput
              {...control}
              value={amount}
              onValueChange={setAmount}
              onBlur={() => form.validateField("amount")}
            />
          )}
        </FormField>
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
        <FormField
          label="Opis"
          hint="Np. wypłata, premia, zwrot podatku"
          optional
          error={form.fieldErrors.description}
        >
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

export { IncomeForm, type IncomeFormProps, type IncomeValues };

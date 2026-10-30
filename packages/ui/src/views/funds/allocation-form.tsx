import { useState } from "react";
import { formatMonth } from "@koperty/ui/lib/dates";
import { formatAmountInput, parsePLN } from "@koperty/ui/lib/money";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";
import { FormField } from "@koperty/ui/primitives/field";
import { useFormSubmit, type SubmitResult } from "@koperty/ui/patterns/use-form-submit";
import { Amount } from "@koperty/ui/product/funds/amount";
import { AmountInput } from "@koperty/ui/product/funds/amount-input";

type AllocationFormProps = {
  envelopeName: string;
  /** "YYYY-MM"; past, current or future (US-16). */
  month: string;
  /** The envelope's allocation in the month, in grosze; 0 when there is none (PRD 4.4). */
  current: number;
  /** The pool before the change, in grosze (PRD 4.3). */
  pool: number;
  /** Calls set_allocation with the new amount; AMOUNT_INVALID maps to the field (error contract). */
  submit: (amount: number) => Promise<SubmitResult<"amount">>;
  onSuccess: () => void;
  onCancel?: () => void;
};

// One allocation per envelope and month, its amount can be changed (PRD 4.4). The pool may go below
// zero (US-16): the form shows it before saving, but doesn't block it.
function AllocationForm({
  envelopeName,
  month,
  current,
  pool,
  submit,
  onSuccess,
  onCancel,
}: AllocationFormProps) {
  const [amount, setAmount] = useState(current > 0 ? formatAmountInput(current) : "");
  const next = parsePLN(amount);
  // A preview for the person; the database computes the pool from history (PRD 4.3).
  const poolAfter = next === null ? null : pool + current - next;

  const form = useFormSubmit<"amount">({
    validate: () => ({
      amount: next === null ? "Podaj kwotę, np. 800 albo 120,50. Zero usuwa przydział." : undefined,
    }),
    // submit runs only after validate() passed, so the amount parses; Number() only narrows the type.
    submit: () => submit(Number(next)),
    onSuccess,
  });

  return (
    <form noValidate onSubmit={form.onSubmit} className="flex flex-col gap-between-groups">
      <FormField
        label={`Przydział: ${envelopeName}, ${formatMonth(month)}`}
        hint="W złotych. Zmniejszenie przydziału zwraca różnicę do puli."
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
      <div aria-live="polite" className="flex flex-col gap-inline">
        {poolAfter !== null && (
          <>
            <p className="flex flex-wrap items-center gap-group text-body text-muted">
              Pula po zapisie: <Amount amount={poolAfter} />
            </p>
            {poolAfter < 0 && (
              <p className="text-body text-default">
                Przydzielasz więcej, niż jest w puli. Możesz to zapisać – pula będzie ujemna.
              </p>
            )}
          </>
        )}
      </div>
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
          Zapisz przydział
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

export { AllocationForm, type AllocationFormProps };

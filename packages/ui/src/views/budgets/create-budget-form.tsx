import type { SubmitResult } from "@koperty/ui/patterns/use-form-submit";
import { NameForm } from "@koperty/ui/patterns/name-form";

type CreateBudgetFormProps = {
  /** Calls create_budget; maps BUDGET_NAME_INVALID to the name field (error contract). */
  submit: (name: string) => Promise<SubmitResult<"name">>;
  onSuccess: () => void;
  onCancel?: () => void;
};

// First run (US-04): one field, the person becomes the owner and the pool starts at 0 zł.
function CreateBudgetForm(props: CreateBudgetFormProps) {
  return (
    <NameForm
      {...props}
      label="Nazwa budżetu"
      hint="Np. Dom albo Wspólne wakacje. Zobaczą ją osoby, które zaprosisz."
      emptyMessage="Podaj nazwę budżetu."
      submitLabel="Utwórz budżet"
      loadingText="Tworzenie…"
    />
  );
}

export { CreateBudgetForm, type CreateBudgetFormProps };

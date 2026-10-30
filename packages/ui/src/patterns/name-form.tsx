import { useState } from "react";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";
import { FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";
import { useFormSubmit, type SubmitResult } from "@koperty/ui/patterns/use-form-submit";

type NameFormProps = {
  label: string;
  hint?: string;
  /** Shown for an empty name, e.g. "Podaj nazwę koperty." */
  emptyMessage: string;
  /** A verb and the object, e.g. "Dodaj kopertę". */
  submitLabel: string;
  loadingText?: string;
  /** The current name when renaming. */
  initial?: string;
  /** Calls the RPC with the trimmed name; maps *_NAME_INVALID or *_NAME_TAKEN to the field. */
  submit: (name: string) => Promise<SubmitResult<"name">>;
  onSuccess: () => void;
  onCancel?: () => void;
};

// One-field form for every name in the product: budget (US-04, US-06), envelope (US-11, US-12) and
// display name (US-24). The name is trimmed; uniqueness and length are checked by the database.
function NameForm({
  label,
  hint,
  emptyMessage,
  submitLabel,
  loadingText = "Zapisywanie…",
  initial = "",
  submit,
  onSuccess,
  onCancel,
}: NameFormProps) {
  const [name, setName] = useState(initial);
  const form = useFormSubmit<"name">({
    validate: () => ({ name: name.trim() ? undefined : emptyMessage }),
    submit: () => submit(name.trim()),
    onSuccess,
  });

  return (
    <form noValidate onSubmit={form.onSubmit} className="flex flex-col gap-between-groups">
      <FormField label={label} hint={hint} error={form.fieldErrors.name}>
        {(control) => (
          <Input
            {...control}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => form.validateField("name")}
          />
        )}
      </FormField>
      {form.formError && (
        <Alert variant="danger">
          <AlertTitle>{form.formError}</AlertTitle>
        </Alert>
      )}
      <div className="flex flex-col gap-group md:flex-row">
        <Button
          type="submit"
          loading={form.submitting}
          loadingText={loadingText}
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

export { NameForm, type NameFormProps };

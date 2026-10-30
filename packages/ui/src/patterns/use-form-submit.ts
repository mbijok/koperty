import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";

// The form pattern (polecenie budowy, standardy 4.5): validate on blur and on submit, focus the first
// error after a failed submit, keep what was typed, block double submits and report success only after
// the server confirms. Business rules stay in the database; validation here only helps the person.

export type FieldErrors<F extends string> = Partial<Record<F, string>>;

export type SubmitResult<F extends string> =
  | { ok: true }
  | { ok: false; fieldErrors?: FieldErrors<F>; formError?: string };

export const OFFLINE_MESSAGE =
  "Brak połączenia z internetem. Wpisane dane zostały w formularzu – wyślij je ponownie, gdy połączenie wróci.";
export const OFFLINE_RETRY_MESSAGE =
  "Brak połączenia z internetem. Spróbuj ponownie, gdy połączenie wróci.";

/** The message for a failed call outside a form: no network, or the given fallback. */
export function failureMessage(fallback: string): string {
  return navigator.onLine ? fallback : OFFLINE_RETRY_MESSAGE;
}

export const SERVER_MESSAGE =
  "Nie udało się zapisać. Wpisane dane zostały w formularzu – spróbuj ponownie za chwilę.";

type FormSubmitOptions<F extends string> = {
  /** Convenience checks in the browser; returns an error per invalid field. */
  validate: () => FieldErrors<F>;
  /** Sends the form; a thrown error is treated as a network or server failure. */
  submit: () => Promise<SubmitResult<F>>;
  /** Called only after the server confirmed the change. */
  onSuccess: () => void;
};

export function useFormSubmit<F extends string>({
  validate,
  submit,
  onSuccess,
}: FormSubmitOptions<F>) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<F>>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  function showErrors(form: HTMLFormElement, errors: FieldErrors<F>) {
    // Commit the errors first, so the first invalid field exists in the DOM when it gets focus.
    flushSync(() => setFieldErrors(errors));
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }

  /** On blur: show or clear the error of one field. */
  function validateField(field: F) {
    const error = validate()[field];
    setFieldErrors((current) => ({ ...current, [field]: error }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const errors = validate();
    if (Object.values(errors).some(Boolean)) {
      showErrors(form, errors);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setFormError(undefined);
    let result: SubmitResult<F>;
    try {
      result = await submit();
    } catch {
      result = { ok: false, formError: navigator.onLine ? SERVER_MESSAGE : OFFLINE_MESSAGE };
    }
    inFlight.current = false;
    setSubmitting(false);

    if (result.ok) {
      setFieldErrors({});
      onSuccess();
      return;
    }
    setFormError(result.formError);
    showErrors(form, result.fieldErrors ?? {});
  }

  return { fieldErrors, formError, submitting, validateField, onSubmit };
}

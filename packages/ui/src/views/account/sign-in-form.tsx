import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import { Button } from "@koperty/ui/primitives/button";
import { FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";
import {
  failureMessage,
  useFormSubmit,
  type SubmitResult,
} from "@koperty/ui/patterns/use-form-submit";

type SignInFormProps = {
  /** Sends the e-mail with a code and a link (signInWithOtp); maps Auth errors to messages (S-01). */
  requestCode: (email: string) => Promise<SubmitResult<"email">>;
  /** Checks the 6-digit code (verifyOtp, S-01 AC-1, AC-3). */
  verifyCode: (email: string, code: string) => Promise<SubmitResult<"code">>;
  onSignedIn: () => void;
  /** Why the person is here: an expired link (AC-3b), an ended session (AC-6b), an invitation (US-08). */
  notice?: string;
};

// Simple format check for convenience only; Supabase Auth decides (S-01 AC-4). The browser trims an
// e-mail input's value.
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_FORMAT = /^\d{6}$/;
const CODE_NOT_SENT = "Nie udało się wysłać kodu. Spróbuj ponownie za chwilę.";

// Sign-in with a code in two steps (S-01): the e-mail first, then the code from the message.
// The e-mail stays when going back, and a new code can be sent without retyping it.
function SignInForm({ requestCode, verifyCode, onSignedIn, notice }: SignInFormProps) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resend, setResend] = useState<{ sending?: boolean; sent?: boolean; error?: string }>({});
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  // A new step replaces the form, so focus moves to its field (WCAG 2.4.3).
  function goTo(next: "email" | "code") {
    flushSync(() => setStep(next));
    (next === "code" ? codeRef : emailRef).current?.focus();
  }

  const emailForm = useFormSubmit<"email">({
    validate: () => ({
      email: EMAIL_FORMAT.test(email)
        ? undefined
        : "Podaj adres e-mail w formacie nazwa@domena.pl.",
    }),
    submit: () => requestCode(email),
    onSuccess: () => {
      setCode("");
      setResend({});
      goTo("code");
    },
  });

  const codeForm = useFormSubmit<"code">({
    validate: () => ({
      code: CODE_FORMAT.test(code) ? undefined : "Wpisz 6 cyfr z wiadomości.",
    }),
    submit: () => verifyCode(email, code),
    onSuccess: onSignedIn,
  });

  async function sendNewCode() {
    setResend({ sending: true });
    try {
      const result = await requestCode(email);
      setResend(result.ok ? { sent: true } : { error: result.formError ?? CODE_NOT_SENT });
    } catch {
      setResend({ error: failureMessage(CODE_NOT_SENT) });
    }
  }

  return (
    <div data-slot="sign-in-form" className="flex flex-col gap-between-groups">
      {notice && (
        <Alert>
          <AlertTitle>{notice}</AlertTitle>
        </Alert>
      )}
      {step === "email" ? (
        <form noValidate onSubmit={emailForm.onSubmit} className="flex flex-col gap-between-groups">
          <FormField
            label="Adres e-mail"
            hint="Wyślemy na niego kod i link do logowania. Bez hasła."
            error={emailForm.fieldErrors.email}
          >
            {(control) => (
              <Input
                {...control}
                ref={emailRef}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => emailForm.validateField("email")}
              />
            )}
          </FormField>
          {emailForm.formError && (
            <Alert variant="danger">
              <AlertTitle>{emailForm.formError}</AlertTitle>
            </Alert>
          )}
          <Button
            type="submit"
            loading={emailForm.submitting}
            loadingText="Wysyłanie…"
            className="w-full md:w-auto md:self-start"
          >
            Wyślij kod
          </Button>
        </form>
      ) : (
        <form noValidate onSubmit={codeForm.onSubmit} className="flex flex-col gap-between-groups">
          <FormField
            label="Kod z wiadomości"
            hint={`Wysłaliśmy go na ${email}. Możesz też otworzyć link z wiadomości.`}
            error={codeForm.fieldErrors.code}
          >
            {(control) => (
              <Input
                {...control}
                ref={codeRef}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                onBlur={() => codeForm.validateField("code")}
              />
            )}
          </FormField>
          {codeForm.formError && (
            <Alert variant="danger">
              <AlertTitle>{codeForm.formError}</AlertTitle>
            </Alert>
          )}
          {resend.error && (
            <Alert variant="danger">
              <AlertTitle>{resend.error}</AlertTitle>
            </Alert>
          )}
          {resend.sent && (
            <Alert>
              <AlertTitle>Wysłaliśmy nowy kod. Poprzedni już nie działa.</AlertTitle>
            </Alert>
          )}
          <Button
            type="submit"
            loading={codeForm.submitting}
            loadingText="Logowanie…"
            className="w-full md:w-auto md:self-start"
          >
            Zaloguj się
          </Button>
          <div className="flex flex-wrap gap-group">
            <Button
              type="button"
              variant="link"
              size="sm"
              loading={resend.sending}
              loadingText="Wysyłanie…"
              onClick={() => void sendNewCode()}
            >
              Wyślij nowy kod
            </Button>
            <Button type="button" variant="link" size="sm" onClick={() => goTo("email")}>
              Zmień adres e-mail
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export { SignInForm, type SignInFormProps };

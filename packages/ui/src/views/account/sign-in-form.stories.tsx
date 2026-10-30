import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import {
  OFFLINE_RETRY_MESSAGE,
  SERVER_MESSAGE,
  type SubmitResult,
} from "@koperty/ui/patterns/use-form-submit";
import { SignInForm } from "@koperty/ui/views/account/sign-in-form";

type EmailResult = SubmitResult<"email">;
type CodeResult = SubmitResult<"code">;

const codeSent = (): Promise<EmailResult> => Promise.resolve({ ok: true });
const signedIn = (): Promise<CodeResult> => Promise.resolve({ ok: true });
// Simulated Auth responses mapped as in S-01 (toAppError): otp_expired, over_email_send_rate_limit.
const codeExpired = (): Promise<CodeResult> =>
  Promise.resolve({
    ok: false,
    fieldErrors: { code: "Kod jest błędny albo wygasł. Wpisz go ponownie albo wyślij nowy kod." },
  });
const rateLimited = (): Promise<EmailResult> =>
  Promise.resolve({
    ok: false,
    formError: "Wysłaliśmy już kilka wiadomości. Poczekaj chwilę przed kolejną próbą.",
  });
const unknownError = (): Promise<EmailResult> => Promise.resolve({ ok: false });
const networkDown = (): Promise<EmailResult> => Promise.reject(new Error("fetch failed"));
const neverAnswers = (): Promise<EmailResult> => new Promise(() => {});

const offline = () => {
  Object.defineProperty(navigator, "onLine", { configurable: true, get: () => false });
  return () => {
    Reflect.deleteProperty(navigator, "onLine");
  };
};

const meta = {
  title: "Wzorce/Logowanie kodem",
  component: SignInForm,
  args: { requestCode: fn(codeSent), verifyCode: fn(signedIn), onSignedIn: fn() },
  decorators: [(Story) => <div className="max-w-content">{Story()}</div>],
} satisfies Meta<typeof SignInForm>;

export default meta;

type Story = StoryObj<typeof meta>;

async function toCodeStep(canvas: Parameters<NonNullable<Story["play"]>>[0]["canvas"]) {
  await userEvent.type(canvas.getByLabelText("Adres e-mail"), " ala@example.com ");
  await userEvent.click(canvas.getByRole("button", { name: "Wyślij kod" }));
  return canvas.findByLabelText("Kod z wiadomości");
}

// AC-1: e-mail, then the 6-digit code; focus moves to the code field.
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const code = await toCodeStep(canvas);
    await expect(args.requestCode).toHaveBeenLastCalledWith("ala@example.com");
    await waitFor(() => expect(code).toHaveFocus());
    await expect(canvas.getByText(/Wysłaliśmy go na ala@example\.com/)).toBeVisible();
    await userEvent.type(code, "12 34-56");
    await expect(code).toHaveValue("123456");
    await userEvent.click(canvas.getByRole("button", { name: "Zaloguj się" }));
    await expect(args.verifyCode).toHaveBeenLastCalledWith("ala@example.com", "123456");
    await waitFor(() => expect(args.onSignedIn).toHaveBeenCalledOnce());
  },
};

// AC-4: a wrong format shows the error and sends nothing.
export const BlednyAdres: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "ala@example");
    await userEvent.tab();
    await expect(canvas.getByText("Podaj adres e-mail w formacie nazwa@domena.pl.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij kod" }));
    await expect(canvas.getByLabelText("Adres e-mail")).toHaveFocus();
    await expect(args.requestCode).not.toHaveBeenCalled();
  },
};

export const Wysylanie: Story = {
  args: { requestCode: fn(neverAnswers) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "ala@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij kod" }));
    await expect(canvas.getByRole("button", { name: "Wysyłanie…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

// Too many messages: the e-mail step shows the Auth limit and keeps the address.
export const LimitWiadomosci: Story = {
  args: { requestCode: fn(rateLimited) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "ala@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij kod" }));
    await expect(await canvas.findByText(/Poczekaj chwilę/)).toBeVisible();
    await expect(canvas.getByLabelText("Adres e-mail")).toHaveValue("ala@example.com");
  },
};

// AC-3: a wrong or expired code – the error at the field and a way to get a new one.
export const BlednyKod: Story = {
  args: { verifyCode: fn(codeExpired) },
  play: async ({ args, canvas }) => {
    const code = await toCodeStep(canvas);
    await userEvent.click(canvas.getByRole("button", { name: "Zaloguj się" }));
    await expect(canvas.getByText("Wpisz 6 cyfr z wiadomości.")).toBeVisible();
    await expect(args.verifyCode).not.toHaveBeenCalled();
    await userEvent.type(code, "654321");
    await userEvent.click(canvas.getByRole("button", { name: "Zaloguj się" }));
    await expect(await canvas.findByText(/Kod jest błędny albo wygasł/)).toBeVisible();
    await expect(args.onSignedIn).not.toHaveBeenCalled();
  },
};

// A new code without retyping the e-mail; changing the e-mail keeps what was typed.
// The code check fails on the server: the code stays in the field.
export const KodBladSerwera: Story = {
  args: { verifyCode: fn((): Promise<CodeResult> => Promise.reject(new Error("500"))) },
  play: async ({ canvas }) => {
    const code = await toCodeStep(canvas);
    await userEvent.type(code, "123456");
    await userEvent.click(canvas.getByRole("button", { name: "Zaloguj się" }));
    await expect(await canvas.findByText(SERVER_MESSAGE)).toBeVisible();
    await expect(code).toHaveValue("123456");
  },
};

export const NowyKodIZmianaAdresu: Story = {
  play: async ({ args, canvas }) => {
    await toCodeStep(canvas);
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij nowy kod" }));
    await expect(await canvas.findByText(/Wysłaliśmy nowy kod/)).toBeVisible();
    await expect(args.requestCode).toHaveBeenCalledTimes(2);
    await userEvent.click(canvas.getByRole("button", { name: "Zmień adres e-mail" }));
    const email = canvas.getByLabelText("Adres e-mail");
    await waitFor(() => expect(email).toHaveFocus());
    await expect(email).toHaveValue("ala@example.com");
  },
};

export const NowyKodWysylanie: Story = {
  play: async ({ args, canvas }) => {
    await toCodeStep(canvas);
    args.requestCode.mockImplementation(neverAnswers);
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij nowy kod" }));
    await expect(canvas.getByRole("button", { name: "Wysyłanie…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

export const NowyKodLimit: Story = {
  play: async ({ args, canvas }) => {
    await toCodeStep(canvas);
    args.requestCode.mockImplementation(rateLimited);
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij nowy kod" }));
    await expect(await canvas.findByText(/Poczekaj chwilę/)).toBeVisible();
  },
};

// An unknown error code gets the default message (S-01: toAppError).
export const NowyKodNieznanyBlad: Story = {
  play: async ({ args, canvas }) => {
    await toCodeStep(canvas);
    args.requestCode.mockImplementation(unknownError);
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij nowy kod" }));
    await expect(
      await canvas.findByText("Nie udało się wysłać kodu. Spróbuj ponownie za chwilę."),
    ).toBeVisible();
  },
};

export const NowyKodBrakSieci: Story = {
  beforeEach: offline,
  play: async ({ args, canvas }) => {
    await toCodeStep(canvas);
    args.requestCode.mockImplementation(networkDown);
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij nowy kod" }));
    await expect(await canvas.findByText(OFFLINE_RETRY_MESSAGE)).toBeVisible();
  },
};

// AC-3b: an expired or used link from the message lands here with a notice.
export const LinkWygasl: Story = {
  args: { notice: "Link wygasł lub został już użyty. Wyślij nową wiadomość." },
};

// AC-6b: the session ended in another tab or expired; after signing in the person goes back.
export const SesjaWygasla: Story = {
  args: { notice: "Sesja wygasła. Zaloguj się ponownie, a wrócisz do miejsca, w którym byłeś." },
};

// US-08: a person who is not signed in opened an invitation link.
export const PrzedDolaczeniem: Story = {
  args: { notice: "Zaloguj się, żeby dołączyć do budżetu „Dom”." },
};

export const WaskiEkran: Story = {
  args: { notice: "Link wygasł lub został już użyty. Wyślij nową wiadomość." },
  render: (args) => (
    <NarrowScreen>
      <SignInForm {...args} />
    </NarrowScreen>
  ),
};

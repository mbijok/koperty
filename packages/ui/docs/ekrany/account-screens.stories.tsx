import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "@koperty/ui/primitives/button";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import { NameForm } from "@koperty/ui/patterns/name-form";
import { SignInForm } from "@koperty/ui/views/account/sign-in-form";
import { PublicScreen, Screen } from "./screen";
import { SCREEN_PARAMETERS } from "./screen-parameters";

const ok = async () => ({ ok: true as const });

const meta = {
  title: "Ekrany/Konto",
  parameters: SCREEN_PARAMETERS,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function SignIn({ notice }: { notice?: string }) {
  return (
    <PublicScreen title="Zaloguj się">
      <SignInForm notice={notice} requestCode={ok} verifyCode={ok} onSignedIn={() => {}} />
    </PublicScreen>
  );
}

export const LogowanieEmail: Story = {
  name: "Logowanie: e-mail",
  render: () => <SignIn />,
};

export const LogowanieKod: Story = {
  name: "Logowanie: kod",
  render: () => <SignIn />,
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "ala@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Wyślij kod" }));
    await expect(await canvas.findByLabelText("Kod z wiadomości")).toBeVisible();
  },
};

export const LogowanieLinkWygasl: Story = {
  name: "Logowanie: link wygasł",
  render: () => <SignIn notice="Link wygasł lub został już użyty. Wyślij nową wiadomość." />,
};

export const LogowanieSesjaWygasla: Story = {
  name: "Logowanie: sesja wygasła",
  render: () => (
    <SignIn notice="Sesja wygasła. Zaloguj się ponownie, a wrócisz do miejsca, w którym byłeś." />
  ),
};

function Profile({ loading = false }: { loading?: boolean }) {
  return (
    <Screen title="Profil">
      {loading ? (
        <div aria-busy="true" className="flex flex-col gap-group">
          <output className="sr-only">Ładowanie profilu…</output>
          <Skeleton className="h-badge w-content" />
          <Skeleton className="h-control w-content" />
        </div>
      ) : (
        <>
          <NameForm
            label="Nazwa wyświetlana"
            hint="Tak zobaczą Cię inni członkowie budżetu jako autora operacji."
            emptyMessage="Podaj nazwę wyświetlaną."
            submitLabel="Zapisz nazwę"
            initial="Ala Kowalska"
            submit={ok}
            onSuccess={() => {}}
          />
          <section aria-labelledby="profile-account" className="flex flex-col gap-group">
            <h2 id="profile-account" className="text-section text-default">
              Konto
            </h2>
            <p className="text-body text-muted">Logujesz się adresem ala@example.com.</p>
            <div className="flex flex-col gap-group md:flex-row">
              <Button variant="secondary" className="w-full md:w-auto">
                Wyloguj
              </Button>
              <Button variant="secondary" className="w-full md:w-auto">
                Usuń konto…
              </Button>
            </div>
          </section>
        </>
      )}
    </Screen>
  );
}

export const Profil: Story = {
  render: () => <Profile />,
  // The profile is opened from the account menu of the shell.
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: "Profil" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: /^Konto:/ }));
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole("menuitem", { name: "Profil" }));
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
  },
};

export const ProfilPustaNazwa: Story = {
  name: "Profil: pusta nazwa",
  render: () => <Profile />,
  play: async ({ canvas }) => {
    await userEvent.clear(canvas.getByLabelText("Nazwa wyświetlana"));
    await userEvent.click(canvas.getByRole("button", { name: "Zapisz nazwę" }));
    await expect(canvas.getByText("Podaj nazwę wyświetlaną.")).toBeVisible();
  },
};

export const ProfilLadowanie: Story = {
  name: "Profil: ładowanie",
  render: () => <Profile loading />,
};

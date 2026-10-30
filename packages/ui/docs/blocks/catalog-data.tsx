import type { ReactNode } from "react";
import { ChartColumn, ListOrdered, Pencil, Wallet } from "lucide-react";
import { Alert, AlertTitle } from "@koperty/ui/primitives/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@koperty/ui/primitives/alert-dialog";
import { Avatar } from "@koperty/ui/primitives/avatar";
import { Badge } from "@koperty/ui/primitives/badge";
import { Button } from "@koperty/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "@koperty/ui/primitives/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@koperty/ui/primitives/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@koperty/ui/primitives/dropdown-menu";
import { EmptyState, ErrorState } from "@koperty/ui/primitives/empty";
import { FormField } from "@koperty/ui/primitives/field";
import { Input } from "@koperty/ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@koperty/ui/primitives/select";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import { Spinner } from "@koperty/ui/primitives/spinner";
import { Switch } from "@koperty/ui/primitives/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@koperty/ui/primitives/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@koperty/ui/primitives/tabs";
import { showToast } from "@koperty/ui/primitives/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@koperty/ui/primitives/tooltip";
import { NameForm } from "@koperty/ui/patterns/name-form";
import { AppShell } from "@koperty/ui/product/account/app-shell";
import { BudgetSwitcher } from "@koperty/ui/product/budgets/budget-switcher";
import { InvitationRow } from "@koperty/ui/product/budgets/invitation-row";
import { InviteLinkPanel } from "@koperty/ui/product/budgets/invite-link-panel";
import { JoinBudgetCard } from "@koperty/ui/product/budgets/join-budget-card";
import { MemberRow } from "@koperty/ui/product/budgets/member-row";
import { EnvelopeCard } from "@koperty/ui/product/envelopes/envelope-card";
import { EnvelopeList } from "@koperty/ui/product/envelopes/envelope-list";
import { OperationList } from "@koperty/ui/product/expenses/operation-list";
import { OperationRow } from "@koperty/ui/product/expenses/operation-row";
import { SplitEditor } from "@koperty/ui/product/expenses/split-editor";
import { Amount } from "@koperty/ui/product/funds/amount";
import { AmountInput } from "@koperty/ui/product/funds/amount-input";
import { MonthSwitcher } from "@koperty/ui/product/funds/month-switcher";
import { PoolSummary } from "@koperty/ui/product/funds/pool-summary";
import { MonthSummaryTable } from "@koperty/ui/product/overview/month-summary-table";
import { SignInForm } from "@koperty/ui/views/account/sign-in-form";
import { CreateBudgetForm } from "@koperty/ui/views/budgets/create-budget-form";
import { ExpenseDetails } from "@koperty/ui/views/expenses/expense-details";
import { ExpenseForm } from "@koperty/ui/views/expenses/expense-form";
import { OperationsPanel } from "@koperty/ui/views/expenses/operations-panel";
import { AllocationForm } from "@koperty/ui/views/funds/allocation-form";
import { IncomeForm } from "@koperty/ui/views/funds/income-form";
import { BIEDRONKA, OPERATIONS } from "#docs/data/operations.ts";

// One entry per documented component, pattern and view (documentation only, not exported from the
// package). "Zacznij tutaj", "Komponenty" and docs/design-system.md list the same items; the test
// catalog.test.ts checks that every module of the package is here and in docs/design-system.md.
// Texts come from sections 1–3 of each component's page.

export type CatalogEntry = {
  name: string;
  group: "Komponenty bazowe" | "Komponenty produktu" | "Wzorce";
  /** Epic of a product component. */
  epic?: string;
  docsId: string;
  importPath: string;
  exports: string;
  description: string;
  when: string;
  whenNot: string;
  /** live: a small working example; static: the real component, inert and clipped. */
  preview: "live" | "static";
  node: ReactNode;
};

export function noop() {}

/** A resolved save for static form previews. */
export function saved() {
  return Promise.resolve({ ok: true as const });
}

export function showSample() {
  showToast("Skopiowano link zaproszenia");
}

const NAVIGATION = [
  { label: "Koperty", href: "#koperty", icon: Wallet, active: true },
  { label: "Operacje", href: "#operacje", icon: ListOrdered },
  { label: "Podsumowanie", href: "#podsumowanie", icon: ChartColumn },
];
const BUDGETS = [
  { id: "dom", name: "Dom" },
  { id: "ochota", name: "Mieszkanie na Ochocie" },
];
const ENVELOPES = [
  { id: "jedzenie", name: "Jedzenie", balance: 17950 },
  { id: "chemia", name: "Chemia", balance: -3000 },
];
const ENVELOPE_OPTIONS = [
  { id: "jedzenie", name: "Jedzenie" },
  { id: "chemia", name: "Chemia" },
];
const PARTS = [
  { id: "p1", envelopeId: "jedzenie", amount: "70,00" },
  { id: "p2", envelopeId: "chemia", amount: "30,00" },
];
const SUMMARY_ROWS = [
  {
    id: "jedzenie",
    name: "Jedzenie",
    start: 12000,
    allocation: 80000,
    expenses: 74050,
    end: 17950,
  },
  { id: "chemia", name: "Chemia", start: 2000, allocation: 6000, expenses: 11000, end: -3000 },
];
const DETAIL = {
  amount: 10000,
  date: "2026-10-29",
  description: "Rossmann i Lidl",
  author: "Tomasz Kowalski",
  parts: [
    { envelope: "Jedzenie", amount: 6500 },
    { envelope: "Chemia", amount: 3500 },
  ],
};

export const CATALOG: CatalogEntry[] = [
  {
    name: "Akcja tekstowa i link",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-akcja-tekstowa-i-link--dokumentacja",
    importPath: "@koperty/ui/primitives/button",
    exports: "Button",
    description:
      "Daje dostęp do mniej ważnej czynności albo innego miejsca w aplikacji bez wizualnej wagi przycisku.",
    when: "„Wyślij nowy kod” na ekranie logowania",
    whenNot: "Główna czynność formularza – zamiast tego: przycisk `primary`",
    preview: "live",
    node: <Button variant="link">Wyślij nowy kod</Button>,
  },
  {
    name: "Alert",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-alert--dokumentacja",
    importPath: "@koperty/ui/primitives/alert",
    exports: "Alert, AlertDescription, AlertTitle",
    description:
      "Mówi o stanie całego ekranu lub formularza i o tym, co zrobić dalej, w miejscu, gdzie użytkownik patrzy.",
    when: "Powód wejścia na logowanie (wygasły link, wygasła sesja); akcją jest formularz pod spodem",
    whenNot: "Błąd jednego pola – zamiast tego: błąd w `FormField`",
    preview: "live",
    node: (
      <Alert>
        <AlertTitle>Brak połączenia z internetem</AlertTitle>
      </Alert>
    ),
  },
  {
    name: "Awatar",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-awatar--dokumentacja",
    importPath: "@koperty/ui/primitives/avatar",
    exports: "Avatar",
    description: "Pomaga szybko rozpoznać osobę na liście po inicjałach obok jej nazwy.",
    when: "Lista członków budżetu",
    whenNot: "Bez nazwy osoby obok – zamiast tego: nazwa osoby (awatar jest dekoracją)",
    preview: "live",
    node: <Avatar name="Ala Kowalska" />,
  },
  {
    name: "Dialog potwierdzenia",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-dialog-potwierdzenia--dokumentacja",
    importPath: "@koperty/ui/primitives/alert-dialog",
    exports:
      "AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger",
    description:
      "Zatrzymuje użytkownika przed operacją, której nie da się cofnąć, i mówi, co dokładnie zostanie usunięte.",
    when: "Usunięcie wydatku lub przychodu",
    whenNot:
      "Operacja odwracalna (archiwizacja koperty – można przywrócić) – zamiast tego: wykonaj od razu, bez pytania",
    preview: "live",
    node: (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary">Usuń wydatek…</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usunąć wydatek „Biedronka”?</AlertDialogTitle>
            <AlertDialogDescription>Kwota wróci do koperty Jedzenie.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction>Usuń wydatek</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    name: "Dialog",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-dialog--dokumentacja",
    importPath: "@koperty/ui/primitives/dialog",
    exports:
      "Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger",
    description:
      "Pozwala wykonać krótką, wydzieloną czynność bez opuszczania ekranu, np. zmienić nazwę koperty.",
    when: "Zmiana nazwy koperty",
    whenNot: "Potwierdzenie operacji nieodwracalnej – zamiast tego: dialog potwierdzenia",
    preview: "live",
    node: (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Zmień nazwę</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zmień nazwę koperty</DialogTitle>
            <DialogDescription>Nowa nazwa pojawi się w całej historii.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    name: "Karta",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-karta--dokumentacja",
    importPath: "@koperty/ui/primitives/card",
    exports: "Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle",
    description:
      "Grupuje informacje i akcje jednego obiektu (pula, koperta, logowanie), żeby dało się je objąć wzrokiem jako całość.",
    when: "Pula „Do rozdysponowania” na widoku kopert",
    whenNot: "Długa lista operacji – zamiast tego: lista operacji",
    preview: "live",
    node: (
      <Card>
        <CardHeader>
          <CardTitle>Do rozdysponowania</CardTitle>
        </CardHeader>
        <CardContent>
          <Amount amount={420000} />
        </CardContent>
      </Card>
    ),
  },
  {
    name: "Menu",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-menu--dokumentacja",
    importPath: "@koperty/ui/primitives/dropdown-menu",
    exports:
      "DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger",
    description:
      "Chowa rzadziej używane akcje obiektu albo listę wyboru (np. budżetów) za jednym przyciskiem, żeby wiersz został czytelny.",
    when: "Akcje koperty: zmień nazwę, zarchiwizuj, przesuń",
    whenNot: "Jedna lub dwie akcje – zamiast tego: przyciski widoczne w wierszu",
    preview: "live",
    node: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Akcje koperty</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Przydziel środki</DropdownMenuItem>
          <DropdownMenuItem>Zmień nazwę</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: "Podpowiedź",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-podpowiedź--dokumentacja",
    importPath: "@koperty/ui/primitives/tooltip",
    exports: "Tooltip, TooltipContent, TooltipTrigger",
    description:
      "Pokazuje widzącym użytkownikom nazwę przycisku z samą ikoną, którą czytnik ekranu odczytuje z `aria-label`.",
    when: "Przyciski ikonowe w wierszach: „Zmień nazwę koperty”, „Usuń wydatek”, „Więcej akcji: Jedzenie”",
    whenNot:
      "Informacja potrzebna do działania (format kwoty, powód blokady) – zamiast tego: podpowiedź pola (`hint`) albo tekst obok przycisku",
    preview: "live",
    node: (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Zmień nazwę koperty">
            <Pencil aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zmień nazwę koperty</TooltipContent>
      </Tooltip>
    ),
  },
  {
    name: "Pole formularza",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-pole-formularza--dokumentacja",
    importPath: "@koperty/ui/primitives/field",
    exports: "FieldGroup, FormField",
    description:
      "Łączy kontrolkę z etykietą, podpowiedzią i błędem, żeby użytkownik (także z czytnikiem ekranu) wiedział, co wpisać i co poprawić.",
    when: "Każde pole formularza: etykieta, podpowiedź i błąd w jednym miejscu",
    whenNot: "Pojedynczy przycisk bez wartości – zamiast tego: Przycisk",
    preview: "live",
    node: (
      <FormField label="Opis" hint="Np. Biedronka" optional>
        {(control) => <Input {...control} />}
      </FormField>
    ),
  },
  {
    name: "Pole tekstowe",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-pole-tekstowe--dokumentacja",
    importPath: "@koperty/ui/primitives/input",
    exports: "Input",
    description: "Pozwala wpisać krótką wartość: e-mail, kod, nazwę, opis, kwotę, datę.",
    when: "Adres e-mail przy logowaniu",
    whenNot: "Wybór z istniejących kopert – zamiast tego: Select",
    preview: "live",
    node: <Input aria-label="Adres e-mail (przykład)" type="email" />,
  },
  {
    name: "Przełącznik",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-przełącznik--dokumentacja",
    importPath: "@koperty/ui/primitives/switch",
    exports: "Switch",
    description:
      "Włącza lub wyłącza ustawienie widoku albo formularza, które działa od razu, bez przycisku „Zapisz”.",
    when: "„Pokaż zarchiwizowane koperty” na liście kopert",
    whenNot: "Czynność (zapis, usunięcie, archiwizacja) – zamiast tego: Przycisk",
    preview: "live",
    node: <Switch aria-label="Pokaż zarchiwizowane koperty" />,
  },
  {
    name: "Przycisk",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-przycisk--dokumentacja",
    importPath: "@koperty/ui/primitives/button",
    exports: "Button",
    description: "Uruchamia czynność na bieżącym ekranie: zapisuje, wysyła, otwiera dialog, usuwa.",
    when: "Wysłanie formularza: „Zapisz wydatek”, „Wyślij kod”, „Utwórz budżet”",
    whenNot:
      "Przejście na inny ekran (adres się zmienia) – zamiast tego: link: `Button asChild` z `<a>` albo linkiem routera – strona „Akcja tekstowa i link”",
    preview: "live",
    node: <Button>Zapisz wydatek</Button>,
  },
  {
    name: "Pusty stan",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-pusty-stan--dokumentacja",
    importPath: "@koperty/ui/primitives/empty",
    exports: "EmptyState",
    description: "Mówi, dlaczego w miejscu listy nic nie ma, i proponuje jeden następny krok.",
    when: "Nowy budżet bez kopert",
    whenNot: "Dane się wczytują – zamiast tego: szkielet ładowania",
    preview: "live",
    node: <EmptyState icon={Wallet} title="Nie masz jeszcze kopert" />,
  },
  {
    name: "Select",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-select--dokumentacja",
    importPath: "@koperty/ui/primitives/select",
    exports: "Select, SelectContent, SelectItem, SelectTrigger, SelectValue",
    description:
      "Pozwala wybrać jedną wartość z krótkiej, znanej listy bez wpisywania, np. kopertę wydatku.",
    when: "Koperta wydatku (jedna koperta)",
    whenNot:
      "Więcej niż około 15 pozycji albo potrzeba wyszukiwania – zamiast tego: pole z wyszukiwaniem (brak w planie, strona „Czego brakuje”)",
    preview: "live",
    node: (
      <Select>
        <SelectTrigger aria-label="Koperta (przykład)">
          <SelectValue placeholder="Wybierz kopertę" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="jedzenie">Jedzenie</SelectItem>
          <SelectItem value="chemia">Chemia</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    name: "Stan błędu",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-stan-błędu--dokumentacja",
    importPath: "@koperty/ui/primitives/empty",
    exports: "ErrorState",
    description:
      "Zastępuje treść, której nie udało się wczytać, mówi, co się stało, i pozwala spróbować ponownie.",
    when: "Błąd wczytania widoku kopert, listy operacji, podsumowania",
    whenNot: "Błąd jednego pola formularza – zamiast tego: błąd w `FormField`",
    preview: "live",
    node: <ErrorState title="Nie udało się wczytać kopert" />,
  },
  {
    name: "Szkielet ładowania",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-szkielet-ładowania--dokumentacja",
    importPath: "@koperty/ui/primitives/skeleton",
    exports: "Skeleton",
    description:
      "Pokazuje kształt treści, która się wczytuje, żeby ekran nie skakał i było wiadomo, co się pojawi.",
    when: "Pierwsze wczytanie widoku kopert i puli",
    whenNot: "Wysyłanie formularza, zapis – zamiast tego: przycisk z `loading`",
    preview: "live",
    node: <Skeleton className="h-badge w-content" />,
  },
  {
    name: "Tabela",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-tabela--dokumentacja",
    importPath: "@koperty/ui/primitives/table",
    exports:
      "Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow",
    description:
      "Pozwala porównać te same liczby dla wielu kopert w kolumnach, np. salda na początek i koniec miesiąca.",
    when: "Podsumowanie miesiąca: saldo na początek, przydział, wydatki, saldo na koniec dla każdej koperty",
    whenNot:
      "Lista operacji (różne pola, akcje w wierszu, czytanie na telefonie) – zamiast tego: lista z wierszami operacji",
    preview: "live",
    node: (
      <Table label="Przykład tabeli">
        <TableHeader>
          <TableRow>
            <TableHead>Koperta</TableHead>
            <TableHead numeric>Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jedzenie</TableCell>
            <TableCell numeric>179,50 zł</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  {
    name: "Toast",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-toast--dokumentacja",
    importPath: "@koperty/ui/primitives/toast",
    exports: "Toaster, showToast",
    description: "Potwierdza na chwilę, że czynność się udała, gdy nic więcej nie trzeba robić.",
    when: "Skopiowanie linku zaproszenia",
    whenNot:
      "Błąd, który wymaga działania – zamiast tego: błąd pola, alert albo stan błędu – `showToast` nie ma wariantu błędu",
    preview: "live",
    node: (
      <Button variant="secondary" onClick={showSample}>
        Kopiuj link zaproszenia
      </Button>
    ),
  },
  {
    name: "Wskaźnik ładowania",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-wskaźnik-ładowania--dokumentacja",
    importPath: "@koperty/ui/primitives/spinner",
    exports: "Spinner",
    description:
      "Pokazuje, że czynność trwa i trzeba chwilę poczekać, gdy nie da się pokazać kształtu wyniku.",
    when: "W przycisku podczas zapisu („Zapisywanie…”) – przycisk sam go dodaje przy `loading`",
    whenNot: "Wczytywanie listy lub kart – zamiast tego: szkielet ładowania",
    preview: "live",
    node: <Spinner />,
  },
  {
    name: "Zakładki",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-zakładki--dokumentacja",
    importPath: "@koperty/ui/primitives/tabs",
    exports: "Tabs, TabsContent, TabsList, TabsTrigger",
    description:
      "Dzieli jeden ekran na kilka równorzędnych części, między którymi użytkownik przełącza się bez zmiany kontekstu.",
    when: "Ustawienia budżetu: „Członkowie” i „Zaproszenia”",
    whenNot:
      "Główna nawigacja aplikacji (koperty, operacje, podsumowanie) – zamiast tego: linki do osobnych stron (każda ma własny adres)",
    preview: "live",
    node: (
      <Tabs defaultValue="a">
        <TabsList aria-label="Przykład zakładek">
          <TabsTrigger value="a">Członkowie</TabsTrigger>
          <TabsTrigger value="b">Zaproszenia</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Ala Kowalska, Tomasz Kowalski</TabsContent>
        <TabsContent value="b">Jeden aktywny link</TabsContent>
      </Tabs>
    ),
  },
  {
    name: "Znacznik",
    group: "Komponenty bazowe",
    docsId: "komponenty-bazowe-znacznik--dokumentacja",
    importPath: "@koperty/ui/primitives/badge",
    exports: "Badge",
    description: "Pokazuje krótki status lub rolę obiektu jednym słowem obok jego nazwy.",
    when: "Rola członka budżetu",
    whenNot: "Komunikat, który wymaga działania – zamiast tego: alert",
    preview: "live",
    node: <Badge>Debet</Badge>,
  },
  {
    name: "Powłoka aplikacji",
    group: "Komponenty produktu",
    epic: "Konto",
    docsId: "komponenty-produktu-konto-powłoka-aplikacji--dokumentacja",
    importPath: "@koperty/ui/product/account/app-shell",
    exports: "AppShell",
    description:
      "Daje każdemu ekranowi po zalogowaniu ten sam nagłówek, nawigację i miejsce na treść, żeby użytkownik zawsze wiedział, gdzie jest i jak szybko dodać wydatek.",
    when: "Układ tras po zalogowaniu (`_authenticated`): nagłówek z nazwą użytkownika i „Wyloguj”",
    whenNot:
      "Ekran logowania i dołączania przed zalogowaniem – zamiast tego: sama karta na środku strony",
    preview: "static",
    node: (
      <AppShell
        displayName="Ala Kowalska"
        onOpenProfile={noop}
        onSignOut={noop}
        navigation={NAVIGATION}
      >
        <p>Treść ekranu</p>
      </AppShell>
    ),
  },
  {
    name: "Karta dołączenia",
    group: "Komponenty produktu",
    epic: "Budżety i członkostwo",
    docsId: "komponenty-produktu-budżety-i-członkostwo-karta-dołączenia--dokumentacja",
    importPath: "@koperty/ui/product/budgets/join-budget-card",
    exports: "JoinBudgetCard",
    description:
      "Po otwarciu linku zaproszenia mówi, do jakiego budżetu i kto zaprasza, i pozwala świadomie dołączyć.",
    when: "Ekran dołączania po otwarciu linku (także po zalogowaniu się z linku)",
    whenNot:
      "Osoba jest już członkiem – zamiast tego: przekierowanie do budżetu bez karty i bez zużycia linku",
    preview: "static",
    node: (
      <JoinBudgetCard
        state="valid"
        budgetName="Dom"
        invitedBy="Ala Kowalska"
        onJoin={noop}
        onGoHome={noop}
      />
    ),
  },
  {
    name: "Panel linku zaproszenia",
    group: "Komponenty produktu",
    epic: "Budżety i członkostwo",
    docsId: "komponenty-produktu-budżety-i-członkostwo-panel-linku-zaproszenia--dokumentacja",
    importPath: "@koperty/ui/product/budgets/invite-link-panel",
    exports: "InviteLinkPanel",
    description:
      "Pozwala właścicielowi wygenerować jednorazowy link i przekazać go dowolnym komunikatorem.",
    when: "Ustawienia budżetu, sekcja „Zaproszenia”",
    whenNot: "Zaproszenie na konkretny e-mail – zamiast tego: brak w MVP",
    preview: "static",
    node: (
      <InviteLinkPanel
        link="https://koperty.app/join/7Hq2-Kx9p"
        expiresOn="2026-11-06"
        onGenerate={noop}
        onCopy={noop}
      />
    ),
  },
  {
    name: "Przełącznik budżetu",
    group: "Komponenty produktu",
    epic: "Budżety i członkostwo",
    docsId: "komponenty-produktu-budżety-i-członkostwo-przełącznik-budżetu--dokumentacja",
    importPath: "@koperty/ui/product/budgets/budget-switcher",
    exports: "BudgetSwitcher",
    description:
      "Pokazuje, w którym budżecie jesteś, i pozwala przejść do innego albo utworzyć nowy.",
    when: "Nagłówek powłoki aplikacji",
    whenNot: "Pierwszy budżet nowego konta – zamiast tego: formularz utworzenia budżetu na ekranie",
    preview: "live",
    node: <BudgetSwitcher budgets={BUDGETS} currentId="dom" onSwitch={noop} onCreate={noop} />,
  },
  {
    name: "Wiersz członka",
    group: "Komponenty produktu",
    epic: "Budżety i członkostwo",
    docsId: "komponenty-produktu-budżety-i-członkostwo-wiersz-członka--dokumentacja",
    importPath: "@koperty/ui/product/budgets/member-row",
    exports: "MemberRow",
    description:
      "Pokazuje osobę w budżecie i jej rolę oraz daje właścicielowi akcje zarządzania, a każdemu – opuszczenie budżetu.",
    when: "Lista członków w ustawieniach budżetu",
    whenNot: "Autor operacji – zamiast tego: wiersz operacji",
    preview: "live",
    node: <MemberRow name="Tomasz Kowalski" memberRole="member" />,
  },
  {
    name: "Wiersz zaproszenia",
    group: "Komponenty produktu",
    epic: "Budżety i członkostwo",
    docsId: "komponenty-produktu-budżety-i-członkostwo-wiersz-zaproszenia--dokumentacja",
    importPath: "@koperty/ui/product/budgets/invitation-row",
    exports: "InvitationRow",
    description:
      "Pokazuje właścicielowi aktywny link zaproszenia, do kiedy działa, i pozwala go unieważnić.",
    when: "Lista aktywnych zaproszeń w ustawieniach budżetu",
    whenNot: "Nowo wygenerowany link do skopiowania – zamiast tego: panel linku zaproszenia",
    preview: "live",
    node: <InvitationRow expiresOn="2026-11-02" createdBy="Ala Kowalska" />,
  },
  {
    name: "Karta koperty",
    group: "Komponenty produktu",
    epic: "Koperty",
    docsId: "komponenty-produktu-koperty-karta-koperty--dokumentacja",
    importPath: "@koperty/ui/product/envelopes/envelope-card",
    exports: "EnvelopeCard, EnvelopeCardSkeleton",
    description: "Pokazuje jedną kopertę: ile w niej zostało, i daje dostęp do jej akcji.",
    when: "Lista kopert na widoku głównym",
    whenNot: "Koperty w podsumowaniu miesiąca – zamiast tego: tabela podsumowania",
    preview: "static",
    node: <EnvelopeCard name="Chemia" balance={-3000} />,
  },
  {
    name: "Lista kopert",
    group: "Komponenty produktu",
    epic: "Koperty",
    docsId: "komponenty-produktu-koperty-lista-kopert--dokumentacja",
    importPath: "@koperty/ui/product/envelopes/envelope-list",
    exports: "EnvelopeList",
    description:
      "Pokazuje wszystkie aktywne koperty budżetu w kolejności ustalonej przez członków, razem ze stanami wczytywania.",
    when: "Widok kopert po otwarciu aplikacji",
    whenNot: "Jedna koperta w innym kontekście – zamiast tego: karta koperty",
    preview: "static",
    node: <EnvelopeList envelopes={ENVELOPES} />,
  },
  {
    name: "Kwota",
    group: "Komponenty produktu",
    epic: "Przychody i przydziały",
    docsId: "komponenty-produktu-przychody-i-przydziały-kwota--dokumentacja",
    importPath: "@koperty/ui/product/funds/amount",
    exports: "Amount",
    description:
      "Pokazuje kwotę w złotych tak samo w całym produkcie i wyraźnie oznacza debet bez straszenia.",
    when: "Saldo koperty, pula „Do rozdysponowania”",
    whenNot: "Wpisywanie kwoty – zamiast tego: pole kwoty",
    preview: "live",
    node: <Amount amount={-3000} />,
  },
  {
    name: "Podsumowanie puli",
    group: "Komponenty produktu",
    epic: "Przychody i przydziały",
    docsId: "komponenty-produktu-przychody-i-przydziały-podsumowanie-puli--dokumentacja",
    importPath: "@koperty/ui/product/funds/pool-summary",
    exports: "PoolSummary",
    description:
      "Pokazuje, ile pieniędzy czeka na przydział do kopert, i mówi, co zrobić, gdy przydzielono za dużo.",
    when: "Góra widoku kopert, nad listą",
    whenNot: "Saldo koperty – zamiast tego: karta koperty",
    preview: "static",
    node: <PoolSummary amount={420000} />,
  },
  {
    name: "Pole kwoty",
    group: "Komponenty produktu",
    epic: "Przychody i przydziały",
    docsId: "komponenty-produktu-przychody-i-przydziały-pole-kwoty--dokumentacja",
    importPath: "@koperty/ui/product/funds/amount-input",
    exports: "AmountInput",
    description:
      "Pozwala wpisać kwotę tak, jak ludzie ją piszą („120,50”, „1 234”), i zamienia ją na grosze bez błędów zaokrągleń.",
    when: "Kwota przychodu",
    whenNot: "Pokazanie kwoty – zamiast tego: kwota (`Amount`)",
    preview: "live",
    node: <AmountInput aria-label="Kwota (przykład)" value="120,50" onValueChange={noop} />,
  },
  {
    name: "Przełącznik miesiąca",
    group: "Komponenty produktu",
    epic: "Przychody i przydziały",
    docsId: "komponenty-produktu-przychody-i-przydziały-przełącznik-miesiąca--dokumentacja",
    importPath: "@koperty/ui/product/funds/month-switcher",
    exports: "MonthSwitcher",
    description:
      "Zmienia miesiąc, którego dotyczą dane na ekranie, także na przyszły, gdy planujesz przydziały.",
    when: "Lista operacji miesiąca",
    whenNot: 'Data jednej operacji – zamiast tego: pole daty (`Input type="date"`)',
    preview: "live",
    node: <MonthSwitcher month="2026-10" onMonthChange={noop} />,
  },
  {
    name: "Edytor podziału",
    group: "Komponenty produktu",
    epic: "Wydatki",
    docsId: "komponenty-produktu-wydatki-edytor-podziału--dokumentacja",
    importPath: "@koperty/ui/product/expenses/split-editor",
    exports: "SplitEditor",
    description:
      "Pozwala rozdzielić jeden paragon na kilka kopert i od razu widać, ile jeszcze zostało do podziału.",
    when: "Formularz wydatku po włączeniu „Podziel wydatek na kilka kopert”",
    whenNot: "Wydatek na jedną kopertę – zamiast tego: select koperty w formularzu",
    preview: "static",
    node: (
      <SplitEditor total={10000} parts={PARTS} envelopes={ENVELOPE_OPTIONS} onPartsChange={noop} />
    ),
  },
  {
    name: "Lista operacji",
    group: "Komponenty produktu",
    epic: "Wydatki",
    docsId: "komponenty-produktu-wydatki-lista-operacji--dokumentacja",
    importPath: "@koperty/ui/product/expenses/operation-list",
    exports: "OperationList",
    description:
      "Pokazuje przychody i wydatki wybranego miesiąca od najnowszych, pogrupowane dniami, żeby łatwo je sprawdzić i poprawić.",
    when: "Ekran „Operacje” z przełącznikiem miesiąca",
    whenNot: "Porównanie kopert w miesiącu – zamiast tego: tabela podsumowania",
    preview: "static",
    node: <OperationList month="2026-10" operations={OPERATIONS} />,
  },
  {
    name: "Wiersz operacji",
    group: "Komponenty produktu",
    epic: "Wydatki",
    docsId: "komponenty-produktu-wydatki-wiersz-operacji--dokumentacja",
    importPath: "@koperty/ui/product/expenses/operation-row",
    exports: "OperationRow",
    description:
      "Pokazuje jeden przychód lub wydatek: ile, na co, z których kopert i kto go zapisał.",
    when: "Wiersz na liście operacji miesiąca",
    whenNot:
      "Pełne dane wydatku z częściami podziału – zamiast tego: widok szczegółów wydatku (wzorzec)",
    preview: "static",
    node: <OperationRow {...BIEDRONKA} />,
  },
  {
    name: "Tabela podsumowania miesiąca",
    group: "Komponenty produktu",
    epic: "Przegląd budżetu",
    docsId: "komponenty-produktu-przegląd-budżetu-tabela-podsumowania-miesiąca--dokumentacja",
    importPath: "@koperty/ui/product/overview/month-summary-table",
    exports: "MonthSummaryTable",
    description:
      "Pokazuje dla każdej koperty, z czym zaczęła miesiąc, ile dostała, ile wydano i ile zostało, oraz przychody i pulę.",
    when: "Ekran „Podsumowanie” wybranego miesiąca",
    whenNot: "Bieżące salda – zamiast tego: lista kopert",
    preview: "static",
    node: <MonthSummaryTable month="2026-10" rows={SUMMARY_ROWS} />,
  },
  {
    name: "Komunikat braku sieci",
    group: "Komponenty produktu",
    epic: "Aplikacja na telefonie",
    docsId: "komponenty-produktu-aplikacja-na-telefonie-komunikat-braku-sieci--dokumentacja",
    importPath: "@koperty/ui/product/app/offline-banner",
    exports: "OfflineBanner",
    description:
      "Informuje, że nie ma połączenia z internetem, i mówi, co to znaczy dla zapisu. Pojawia się i znika sam.",
    when: "Raz w układzie ekranów po zalogowaniu",
    whenNot: "Nieudany zapis formularza – zamiast tego: komunikat formularza",
    preview: "static",
    node: (
      <Alert>
        <AlertTitle>Brak połączenia z internetem</AlertTitle>
      </Alert>
    ),
  },
  {
    name: "Brak sieci i wygasła sesja",
    group: "Wzorce",
    docsId: "wzorce-brak-sieci-i-wygasła-sesja--dokumentacja",
    importPath: "@koperty/ui/product/app/offline-banner",
    exports: "OfflineBanner",
    description:
      "Mówi wprost, co się stało, gdy znika połączenie albo kończy się sesja, i co zrobić dalej. Aplikacja nie ma trybu offline; dane wczytane wcześniej zostają na ekranie.",
    when: "Utrata połączenia w trakcie pracy",
    whenNot: "Nieudany zapis formularza – zamiast tego: komunikat formularza (dane zostają)",
    preview: "static",
    node: (
      <Alert>
        <AlertTitle>Brak połączenia z internetem</AlertTitle>
      </Alert>
    ),
  },
  {
    name: "Formularz nazwy",
    group: "Wzorce",
    docsId: "wzorce-formularz-nazwy--dokumentacja",
    importPath: "@koperty/ui/patterns/name-form",
    exports: "NameForm",
    description:
      "Jedno pole na każdą nazwę w produkcie: budżetu, koperty i nazwę wyświetlaną. Zachowanie wzorca „Formularz” (walidacja, fokus, dane zostają, blokada podwójnego wysłania) bez pisania go od nowa.",
    when: "Nowa koperta, zmiana nazwy koperty",
    whenNot: "Formularz z kilkoma polami – zamiast tego: `useFormSubmit`",
    preview: "static",
    node: (
      <NameForm
        label="Nazwa koperty"
        emptyMessage="Podaj nazwę koperty."
        submitLabel="Dodaj kopertę"
        submit={saved}
        onSuccess={noop}
      />
    ),
  },
  {
    name: "Formularz",
    group: "Wzorce",
    docsId: "wzorce-formularz--dokumentacja",
    importPath: "@koperty/ui/patterns/use-form-submit",
    exports: "useFormSubmit",
    description:
      "Zapisuje dane przez funkcję RPC tak, żeby osoba nigdy nie straciła tego, co wpisała, i wiedziała, czy zapis się udał. Hak `useFormSubmit` realizuje zachowanie, a `IncomeForm` (przychód, US-14) pokazuje je na prawdziwym formularzu.",
    when: "Każdy formularz zapisujący dane: przychód, przydział, wydatek",
    whenNot:
      "Pojedyncza akcja bez pól (usuń, archiwizuj) – zamiast tego: potwierdzenie usunięcia albo przycisk",
    preview: "static",
    node: <IncomeForm submit={saved} onSuccess={noop} />,
  },
  {
    name: "Formularz przychodu",
    group: "Wzorce",
    docsId: "wzorce-formularz--dokumentacja",
    importPath: "@koperty/ui/views/funds/income-form",
    exports: "IncomeForm",
    description:
      "Przykład referencyjny wzorca formularza: przychód z kwotą, datą i opcjonalnym opisem.",
    when: "Nowy przychód i edycja przychodu",
    whenNot: "Przydział do koperty – zamiast tego: formularz przydziału",
    preview: "static",
    node: <IncomeForm submit={saved} onSuccess={noop} submitLabel="Zapisz przychód" />,
  },
  {
    name: "Kwota ujemna i debet",
    group: "Wzorce",
    docsId: "wzorce-kwota-ujemna-i-debet--dokumentacja",
    importPath: "@koperty/ui/views/funds/allocation-form",
    exports: "AllocationForm",
    description:
      "Pokazuje ujemne salda i ujemną pulę tak samo w całym produkcie oraz prowadzi do wyjścia z debetu: zwiększenia przydziału. Formularz przydziału pokazuje pulę po zapisie, zanim osoba zapisze.",
    when: "Przydział środków do koperty (także przyszły)",
    whenNot: 'Kwota wydatku w liście – zamiast tego: kwota `kind="expense"` (bez minusa)',
    preview: "static",
    node: (
      <AllocationForm
        envelopeName="Chemia"
        month="2026-10"
        current={30000}
        pool={-20000}
        submit={saved}
        onSuccess={noop}
      />
    ),
  },
  {
    name: "Lista z filtrem miesiąca",
    group: "Wzorce",
    docsId: "wzorce-lista-z-filtrem-miesiąca--dokumentacja",
    importPath: "@koperty/ui/views/expenses/operations-panel",
    exports: "OperationsPanel",
    description:
      "Pokazuje operacje wybranego miesiąca z licznikiem wyników i widocznym filtrem. Filtrem w MVP jest miesiąc (Q5); innych filtrów nie ma.",
    when: "Ekran „Operacje”",
    whenNot: "Porównanie kopert w miesiącu – zamiast tego: tabela podsumowania",
    preview: "static",
    node: (
      <OperationsPanel
        month="2026-10"
        currentMonth="2026-10"
        onMonthChange={noop}
        operations={OPERATIONS}
      />
    ),
  },
  {
    name: "Logowanie kodem",
    group: "Wzorce",
    docsId: "wzorce-logowanie-kodem--dokumentacja",
    importPath: "@koperty/ui/views/account/sign-in-form",
    exports: "SignInForm",
    description:
      "Loguje bez hasła w dwóch krokach: adres e-mail, potem 6-cyfrowy kod z wiadomości (S-01). Link z tej samej wiadomości działa równolegle i nie wymaga formularza.",
    when: "Ekran `/login`",
    whenNot: "Zmiana nazwy wyświetlanej – zamiast tego: formularz (wzorzec Formularz)",
    preview: "static",
    node: <SignInForm requestCode={saved} verifyCode={saved} onSignedIn={noop} />,
  },
  {
    name: "Nawigacja po miesiącach",
    group: "Wzorce",
    docsId: "wzorce-nawigacja-po-miesiącach--dokumentacja",
    importPath: "@koperty/ui/product/funds/month-switcher",
    exports: "MonthSwitcher",
    description:
      "Przełącza widok między miesiącami: przeszłymi (sprawdzenie), bieżącym i przyszłymi (planowanie przydziałów). Wzorzec łączy przełącznik miesiąca z danymi miesiąca i powrotem do bieżącego.",
    when: "Podsumowanie miesiąca",
    whenNot: "Wybór daty wydatku – zamiast tego: pole daty",
    preview: "static",
    node: <MonthSwitcher month="2026-11" onMonthChange={noop} />,
  },
  {
    name: "Pierwsze uruchomienie",
    group: "Wzorce",
    docsId: "wzorce-pierwsze-uruchomienie--dokumentacja",
    importPath: "@koperty/ui/views/budgets/create-budget-form",
    exports: "CreateBudgetForm",
    description:
      "Prowadzi nową osobę od pustego konta do pierwszego budżetu, a potem do dwóch pierwszych kroków: koperty i przychodu.",
    when: "Po pierwszym zalogowaniu, bez budżetów",
    whenNot: "Dołączenie do cudzego budżetu – zamiast tego: zaproszenie (karta dołączenia)",
    preview: "static",
    node: <CreateBudgetForm submit={saved} onSuccess={noop} />,
  },
  {
    name: "Podział wydatku",
    group: "Wzorce",
    docsId: "wzorce-podział-wydatku--dokumentacja",
    importPath: "@koperty/ui/views/expenses/expense-form",
    exports: "ExpenseForm",
    description:
      "Zapisuje wydatek szybko na telefonie: kwota, koperta, data i opcjonalny opis. Jeden paragon można podzielić na kilka kopert.",
    when: "Nowy wydatek i edycja wydatku (osobne strony)",
    whenNot: "Przychód – zamiast tego: formularz przychodu",
    preview: "static",
    node: <ExpenseForm envelopes={ENVELOPE_OPTIONS} submit={saved} onSuccess={noop} />,
  },
  {
    name: "Potwierdzenie usunięcia",
    group: "Wzorce",
    docsId: "wzorce-potwierdzenie-usunięcia--dokumentacja",
    importPath: "@koperty/ui/patterns/confirm-delete-dialog",
    exports: "ConfirmDeleteDialog",
    description:
      "Pyta o usunięcie obiektu z jego nazwą, czeka na serwer i zamyka się dopiero po potwierdzeniu usunięcia. Rezygnacja jest łatwiejsza niż usunięcie.",
    when: "Usunięcie przychodu, wydatku",
    whenNot: "Archiwizacja koperty (odwracalna) – zamiast tego: akcja bez pytania + przywróć",
    preview: "static",
    node: <Button variant="secondary">Usuń wydatek…</Button>,
  },
  {
    name: "Widok szczegółów",
    group: "Wzorce",
    docsId: "wzorce-widok-szczegółów--dokumentacja",
    importPath: "@koperty/ui/views/expenses/expense-details",
    exports: "ExpenseDetails",
    description:
      "Pokazuje jeden obiekt (tu: wydatek) tak, że najważniejsza informacja i główna akcja są widoczne bez przewijania, a szczegóły leżą niżej.",
    when: "Wydatek otwarty z listy operacji",
    whenNot: "Szybka edycja kwoty w liście – zamiast tego: formularz wydatku",
    preview: "static",
    node: <ExpenseDetails expense={DETAIL} onBack={noop} />,
  },
  {
    name: "Zaproszenie",
    group: "Wzorce",
    docsId: "wzorce-zaproszenie--dokumentacja",
    importPath: "@koperty/ui/product/budgets/invite-link-panel",
    exports: "InviteLinkPanel",
    description:
      "Prowadzi przez obie strony zaproszenia: właściciel tworzy jednorazowy link i przekazuje go dowolnym kanałem, a zaproszona osoba otwiera go, w razie potrzeby loguje się i dołącza.",
    when: "Ustawienia budżetu: zaproszenia",
    whenNot: "Zmiana roli członka – zamiast tego: wiersz członka",
    preview: "static",
    node: <InvitationRow expiresOn="2026-11-02" createdBy="Ala Kowalska" />,
  },
];

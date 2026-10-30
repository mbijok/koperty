import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NarrowScreen } from "#docs/blocks/frames.tsx";
import { Badge } from "@koperty/ui/primitives/badge";
import { Skeleton } from "@koperty/ui/primitives/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@koperty/ui/primitives/table";

// US-22: start balance + allocation − expenses = end balance, per envelope used in the month.
const ROWS = [
  {
    name: "Jedzenie",
    start: "120,00 zł",
    allocation: "800,00 zł",
    expenses: "740,50 zł",
    end: "179,50 zł",
  },
  {
    name: "Rachunki",
    start: "0,00 zł",
    allocation: "1 250,00 zł",
    expenses: "1 250,00 zł",
    end: "0,00 zł",
  },
  {
    name: "Chemia",
    start: "20,00 zł",
    allocation: "60,00 zł",
    expenses: "110,00 zł",
    end: "−30,00 zł",
    debit: true,
  },
  {
    name: "Wakacje",
    start: "1 600,00 zł",
    allocation: "400,00 zł",
    expenses: "0,00 zł",
    end: "2 000,00 zł",
  },
];

function SummaryHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead scope="col">Koperta</TableHead>
        <TableHead scope="col" numeric>
          Saldo na początek
        </TableHead>
        <TableHead scope="col" numeric>
          Przydział
        </TableHead>
        <TableHead scope="col" numeric>
          Wydatki
        </TableHead>
        <TableHead scope="col" numeric>
          Saldo na koniec
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

function MonthSummary({ rows = ROWS }: { rows?: typeof ROWS }) {
  return (
    <Table label="Podsumowanie miesiąca">
      <TableCaption>Podsumowanie października 2026</TableCaption>
      <SummaryHead />
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableHead scope="row" className="font-normal whitespace-normal">
              {row.name}
            </TableHead>
            <TableCell numeric>{row.start}</TableCell>
            <TableCell numeric>{row.allocation}</TableCell>
            <TableCell numeric>{row.expenses}</TableCell>
            <TableCell numeric>
              <span className="inline-flex items-center gap-inline">
                {row.end}
                {row.debit && <Badge>Debet</Badge>}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead scope="row">Razem</TableHead>
          <TableCell numeric>1 740,00 zł</TableCell>
          <TableCell numeric>2 510,00 zł</TableCell>
          <TableCell numeric>2 100,50 zł</TableCell>
          <TableCell numeric>2 149,50 zł</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

const meta = {
  title: "Komponenty bazowe/Tabela",
  component: Table,
  args: { label: "Podsumowanie miesiąca" },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div className="max-w-content-wide">
      <MonthSummary />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("table", { name: "Podsumowanie października 2026" }),
    ).toBeVisible();
    await expect(canvas.getAllByRole("columnheader")).toHaveLength(5);
    await expect(canvas.getByRole("rowheader", { name: "Chemia" })).toBeVisible();
  },
};

// Loading keeps the table's shape; the container announces the state.
export const Ladowanie: Story = {
  render: () => (
    <div className="max-w-content-wide" aria-busy="true">
      <output className="sr-only">Ładowanie podsumowania miesiąca…</output>
      <Table label="Podsumowanie miesiąca">
        <SummaryHead />
        <TableBody>
          {[1, 2, 3].map((row) => (
            <TableRow key={row}>
              {[1, 2, 3, 4, 5].map((cell) => (
                <TableCell key={cell}>
                  <Skeleton className="h-badge" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Ładowanie podsumowania miesiąca…");
  },
};

export const DuzoDanych: Story = {
  render: () => (
    <div className="max-w-content-wide">
      <MonthSummary
        rows={[
          ...ROWS,
          {
            name: "Transport",
            start: "50,00 zł",
            allocation: "300,00 zł",
            expenses: "280,00 zł",
            end: "70,00 zł",
          },
          {
            name: "Zdrowie",
            start: "200,00 zł",
            allocation: "150,00 zł",
            expenses: "89,99 zł",
            end: "260,01 zł",
          },
          {
            name: "Dzieci",
            start: "0,00 zł",
            allocation: "500,00 zł",
            expenses: "512,30 zł",
            end: "−12,30 zł",
            debit: true,
          },
          {
            name: "Prezenty",
            start: "300,00 zł",
            allocation: "100,00 zł",
            expenses: "0,00 zł",
            end: "400,00 zł",
          },
        ]}
      />
    </div>
  ),
};

export const WaskiEkran: Story = {
  render: () => (
    <NarrowScreen>
      <MonthSummary
        rows={[
          ...ROWS,
          {
            name: "Remont łazienki i kuchni w mieszkaniu na Ochocie",
            start: "12 500,00 zł",
            allocation: "8 000,00 zł",
            expenses: "15 230,40 zł",
            end: "5 269,60 zł",
          },
        ]}
      />
    </NarrowScreen>
  ),
};

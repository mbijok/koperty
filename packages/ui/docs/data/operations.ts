import type { Operation } from "@koperty/ui/product/expenses/operation-row";

// Example operations for stories (documentation only, not exported): invented, realistic, based on PRD user stories.
export const BIEDRONKA: Operation = {
  id: "e1",
  type: "expense",
  amount: 12050,
  date: "2026-10-29",
  description: "Biedronka",
  envelopes: ["Jedzenie"],
  author: "Ala Kowalska",
};
export const SPLIT_EXPENSE: Operation = {
  id: "e2",
  type: "expense",
  amount: 10000,
  date: "2026-10-29",
  description: "Rossmann i Lidl",
  envelopes: ["Jedzenie", "Chemia"],
  author: "Tomasz Kowalski",
};
export const SALARY: Operation = {
  id: "i1",
  type: "income",
  amount: 500000,
  date: "2026-10-28",
  description: "Wypłata",
  author: "Ala Kowalska",
};
export const NO_DESCRIPTION: Operation = {
  id: "e3",
  type: "expense",
  amount: 25000,
  date: "2026-10-28",
  envelopes: ["Rachunki"],
  author: "Tomasz Kowalski",
};
export const DELETED_AUTHOR: Operation = {
  id: "e4",
  type: "expense",
  amount: 4999,
  date: "2026-10-26",
  description: "Bilet miesięczny",
  envelopes: ["Transport"],
  author: "Usunięty użytkownik",
};

export const OPERATIONS: Operation[] = [
  BIEDRONKA,
  SPLIT_EXPENSE,
  SALARY,
  NO_DESCRIPTION,
  DELETED_AUTHOR,
];

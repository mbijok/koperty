import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@koperty/ui/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@koperty/ui/primitives/dropdown-menu";

type BudgetOption = { id: string; name: string };

type BudgetSwitcherProps = {
  budgets: BudgetOption[];
  currentId: string;
  /** Switching shows only the chosen budget's data (US-05). */
  onSwitch: (id: string) => void;
  onCreate: () => void;
};

function BudgetSwitcher({ budgets, currentId, onSwitch, onCreate }: BudgetSwitcherProps) {
  const current = budgets.find((budget) => budget.id === currentId);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="max-w-full min-w-0 px-inline">
          <span className="sr-only">Budżet:</span>
          <span className="min-w-0 truncate text-section">{current?.name ?? "Wybierz budżet"}</span>
          <ChevronDown aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Budżety</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={currentId} onValueChange={onSwitch}>
          {budgets.map((budget) => (
            <DropdownMenuRadioItem key={budget.id} value={budget.id}>
              {budget.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onCreate}>
          <Plus aria-hidden="true" />
          Utwórz budżet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { BudgetSwitcher, type BudgetOption, type BudgetSwitcherProps };

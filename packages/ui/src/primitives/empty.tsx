import type { ReactNode } from "react";
import { CircleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@koperty/ui/lib/utils";

type StateMessageProps = {
  /** What is missing or what happened, e.g. "Nie masz jeszcze kopert". */
  title: string;
  /** One sentence: why it is empty or what to do now. */
  description?: string;
  /** One next step, usually a button. */
  action?: ReactNode;
  className?: string;
};

// No border, start-aligned like the rest of the page, 20 px icon in text-muted, section-size title,
// one sentence and one action (E2-Q5; "Czego unikać": not everything centred).
function StateMessage({
  title,
  description,
  action,
  className,
  icon: Icon,
  tone,
  role,
}: StateMessageProps & { icon: LucideIcon; tone: "muted" | "danger"; role?: "alert" }) {
  return (
    <div
      data-slot="state-message"
      role={role}
      className={cn("flex max-w-measure flex-col items-start gap-group py-section", className)}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-icon-standalone", tone === "danger" ? "text-danger" : "text-muted")}
      />
      <div className="flex flex-col gap-inline">
        <p className="text-section text-default">{title}</p>
        {description && <p className="text-body text-muted">{description}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-group">{action}</div>}
    </div>
  );
}

/** Nothing to show yet, or nothing for the chosen month; says why and offers the next step. */
function EmptyState({ icon, ...props }: StateMessageProps & { icon: LucideIcon }) {
  return <StateMessage icon={icon} tone="muted" {...props} />;
}

/** Data could not be loaded; announced at once and offers a retry (WCAG 4.1.3, 3.3.1). */
function ErrorState(props: StateMessageProps) {
  return <StateMessage icon={CircleAlert} tone="danger" role="alert" {...props} />;
}

export { EmptyState, ErrorState, type StateMessageProps };

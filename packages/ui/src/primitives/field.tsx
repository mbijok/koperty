import { useId, type ComponentProps, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@koperty/ui/lib/utils";
import { Label } from "@koperty/ui/primitives/label";

/** Props a form control needs to be tied to its label, hint and error. */
type FieldControlProps = {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-required": true | undefined;
};

type FormFieldProps = {
  label: string;
  /** Help shown under the field; an example belongs here, not in the placeholder. */
  hint?: string;
  /** Message after validation: what is wrong and how to fix it. */
  error?: string;
  /** Marks the label with "(opcjonalnie)"; other fields are required (E2-P1). */
  optional?: boolean;
  /** "horizontal" puts the control after the label, e.g. for a switch. */
  orientation?: "vertical" | "horizontal";
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
};

function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex w-full flex-col gap-between-groups", className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("max-w-measure text-meta text-muted", className)}
      {...props}
    />
  );
}

function FieldError({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      role="alert"
      data-slot="field-error"
      className={cn("flex max-w-measure items-start gap-inline text-meta text-danger", className)}
      {...props}
    >
      <CircleAlert aria-hidden="true" className="size-icon shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function FormField({
  label,
  hint,
  error,
  optional = false,
  orientation = "vertical",
  className,
  children,
}: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ");
  const control = children({
    id,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-required": optional ? undefined : true,
  });
  const labelAndHint = (
    <div className="flex flex-col gap-inline">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted">(opcjonalnie)</span>}
      </Label>
      {hint && <FieldDescription id={hintId}>{hint}</FieldDescription>}
    </div>
  );

  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      data-invalid={error ? true : undefined}
      className={cn("flex w-full flex-col gap-group", className)}
    >
      {orientation === "horizontal" ? (
        <div className="flex items-center justify-between gap-between-groups">
          {labelAndHint}
          {control}
        </div>
      ) : (
        <>
          {labelAndHint}
          {control}
        </>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export {
  FieldDescription,
  FieldError,
  FieldGroup,
  FormField,
  type FieldControlProps,
  type FormFieldProps,
};

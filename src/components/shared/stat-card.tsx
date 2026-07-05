import { cva, type VariantProps } from "class-variance-authority";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fitTextSizeClass } from "@/lib/fit-text";

// Font size shrinks in steps as the value string gets longer, so amounts
// like "Rp 1.250.000.000" stay on one line instead of wrapping/overflowing.
const VALUE_SIZE_TIERS: ReadonlyArray<readonly [number, string]> = [
  [9, "text-2xl"],
  [12, "text-xl"],
  [14, "text-lg"],
  [17, "text-base"],
];
const VALUE_SIZE_FALLBACK = "text-sm";

const valueVariants = cva("font-bold tracking-tight leading-tight", {
  variants: {
    tone: {
      default: "text-foreground",
      primary: "text-primary",
      warning: "text-warning",
      success: "text-success",
      danger: "text-destructive",
    },
  },
  defaultVariants: { tone: "default" },
});

const highlightVariants = cva("shadow-[var(--shadow-elevated)]", {
  variants: {
    tone: {
      default: "border-border bg-gradient-to-br from-secondary to-muted",
      primary: "border-primary/25 bg-gradient-to-br from-accent to-primary/10",
      warning: "border-warning/25 bg-gradient-to-br from-warning/10 to-warning/5",
      success: "border-success/25 bg-gradient-to-br from-success/10 to-success/5",
      danger:
        "border-destructive/25 bg-gradient-to-br from-destructive/10 to-destructive/5",
    },
  },
  defaultVariants: { tone: "default" },
});

interface StatCardProps extends VariantProps<typeof valueVariants> {
  label: string;
  /** Pre-formatted value, e.g. "Rp 0" or "0 unit". */
  value: string;
  /** Emphasized card (e.g. "Total modal keseluruhan"). */
  highlighted?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  tone,
  highlighted,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "min-w-0 gap-1.5 py-4",
        highlighted && highlightVariants({ tone }),
        className,
      )}
    >
      <div className="min-w-0 px-4">
        <p className="truncate text-[13px] font-medium text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            valueVariants({ tone }),
            fitTextSizeClass(value, VALUE_SIZE_TIERS, VALUE_SIZE_FALLBACK),
            "mt-1 whitespace-nowrap",
          )}
        >
          {value}
        </p>
      </div>
    </Card>
  );
}

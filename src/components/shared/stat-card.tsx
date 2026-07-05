import { cva, type VariantProps } from "class-variance-authority";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const valueVariants = cva("text-2xl font-bold tracking-tight leading-tight", {
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
        "gap-1.5 py-4",
        highlighted && highlightVariants({ tone }),
        className,
      )}
    >
      <div className="px-4">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        <p className={cn(valueVariants({ tone }), "mt-1")}>{value}</p>
      </div>
    </Card>
  );
}

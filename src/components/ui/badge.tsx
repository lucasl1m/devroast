import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const badgeVariants = tv({
  base: "inline-flex items-center gap-2 font-mono text-xs",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      verdict: "text-accent-red",
      info: "text-accent-blue",
      success: "text-success",
    },
    size: {
      default: "text-xs",
      sm: "text-[10px]",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "info",
    size: "default",
  },
});

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
type BadgeSize = NonNullable<VariantProps<typeof badgeVariants>["size"]>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  showDot?: boolean;
}

export type { BadgeSize, BadgeVariant };

function Badge({
  className,
  variant = "info",
  size = "default",
  showDot = true,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={twMerge(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {showDot && (
        <span
          className={twMerge(
            "block h-2 w-2 rounded-full",
            variant === "critical" && "bg-accent-red",
            variant === "warning" && "bg-accent-amber",
            variant === "good" && "bg-accent-green",
            variant === "verdict" && "bg-accent-red",
            variant === "info" && "bg-accent-blue",
            variant === "success" && "bg-success"
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };

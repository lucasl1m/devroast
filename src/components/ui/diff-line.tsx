import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const diffLineVariants = tv({
  base: "flex gap-2 px-4 py-2 font-mono text-sm",
  variants: {
    variant: {
      removed: "bg-diff-removed",
      added: "bg-diff-added",
      context: "",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

const diffPrefixVariants = tv({
  base: "w-3 font-mono",
  variants: {
    variant: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

const diffCodeVariants = tv({
  base: "font-mono text-sm",
  variants: {
    variant: {
      removed: "text-text-secondary",
      added: "text-text-primary",
      context: "text-text-secondary",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

type DiffLineVariant = NonNullable<
  VariantProps<typeof diffLineVariants>["variant"]
>;

export interface DiffLineProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DiffLineVariant;
  prefix?: string;
  code: string;
}

export type { DiffLineVariant };

function DiffLine({
  className,
  variant = "context",
  prefix = " ",
  code,
  ...props
}: DiffLineProps) {
  return (
    <div
      className={twMerge(diffLineVariants({ variant, className }))}
      {...props}
    >
      <span className={diffPrefixVariants({ variant })}>{prefix}</span>
      <span className={diffCodeVariants({ variant })}>{code}</span>
    </div>
  );
}

export { DiffLine, diffLineVariants };

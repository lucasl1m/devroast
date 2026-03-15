import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const cardVariants = tv({
  base: "rounded-md border border-border-primary p-5 bg-bg-surface",
  variants: {
    variant: {
      default: "border-border-primary",
      success: "border-accent-green/50",
      warning: "border-accent-amber/50",
      error: "border-accent-red/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const cardDotVariants = tv({
  base: "h-2 w-2 rounded-full",
  variants: {
    variant: {
      critical: "bg-accent-red",
      warning: "bg-accent-amber",
      good: "bg-accent-green",
      success: "bg-accent-green",
      info: "bg-accent-blue",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type CardVariant = NonNullable<VariantProps<typeof cardVariants>["variant"]>;

export type { CardVariant };

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export interface CardDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: NonNullable<VariantProps<typeof cardDotVariants>["variant"]>;
}

export interface CardLabelProps extends React.HTMLAttributes<HTMLSpanElement> {}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardRoot({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div className={twMerge(cardVariants({ variant, className }))} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={twMerge("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

function CardDot({ className, variant = "info", ...props }: CardDotProps) {
  return (
    <span
      className={twMerge(cardDotVariants({ variant }), className)}
      {...props}
    />
  );
}

function CardLabel({ className, children, ...props }: CardLabelProps) {
  return (
    <span className={twMerge("font-mono text-xs", className)} {...props}>
      {children}
    </span>
  );
}

function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3
      className={twMerge("font-mono text-sm text-text-primary", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={twMerge(
        "font-mono text-xs text-text-secondary leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Dot: CardDot,
  Label: CardLabel,
  Title: CardTitle,
  Description: CardDescription,
});

export {
  Card,
  CardDescription,
  CardDot,
  CardHeader,
  CardLabel,
  CardRoot,
  CardTitle,
  cardVariants,
};

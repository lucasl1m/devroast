import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:pointer-events-none disabled:opacity-50 font-mono",
  variants: {
    variant: {
      primary:
        "bg-accent-green text-neutral-900 hover:bg-accent-green/90 focus-visible:ring-accent-green font-[500]",
      secondary:
        "bg-transparent border border-border-primary text-text-primary hover:bg-border-primary/50 hover:border-border-secondary focus-visible:ring-border-secondary",
      outline:
        "border border-border-primary bg-transparent text-text-primary hover:bg-border-primary/50 focus-visible:ring-border-secondary",
      ghost:
        "hover:bg-border-primary/50 text-text-secondary hover:text-text-primary focus-visible:ring-border-secondary",
      destructive:
        "bg-accent-red text-white hover:bg-accent-red/90 focus-visible:ring-accent-red",
      link: "text-text-tertiary underline-offset-4 hover:underline hover:text-text-secondary",
    },
    size: {
      default: "h-auto px-6 py-2.5 text-[13px]",
      sm: "h-auto px-4 py-2 text-[12px]",
      lg: "h-auto px-8 py-3 text-[14px]",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

export type { ButtonSize, ButtonVariant };

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const inputVariants = tv({
  base: "flex items-center gap-2 rounded-md border border-border-primary bg-bg-input px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-green focus:ring-offset-2 focus:ring-offset-bg-page disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      default: "border-border-primary",
      error: "border-accent-red focus:ring-accent-red",
      success: "border-accent-green focus:ring-accent-green",
    },
    size: {
      default: "h-10 text-sm",
      sm: "h-8 text-xs px-2",
      lg: "h-12 text-base px-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type InputVariant = NonNullable<VariantProps<typeof inputVariants>["variant"]>;
type InputSize = NonNullable<VariantProps<typeof inputVariants>["size"]>;

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
}

export interface InputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export interface InputIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

export interface InputRightElementProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

export type { InputSize, InputVariant };

function Input({
  className,
  variant = "default",
  size = "default",
  ...props
}: InputProps) {
  return (
    <input
      className={twMerge(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function InputLabel({ className, children, ...props }: InputLabelProps) {
  return (
    <label
      className={twMerge("text-xs text-text-secondary", className)}
      {...props}
    >
      {children}
    </label>
  );
}

function InputIcon({ className, children, ...props }: InputIconProps) {
  return (
    <span
      className={twMerge("flex items-center text-text-tertiary", className)}
      {...props}
    >
      {children}
    </span>
  );
}

function InputRightElement({
  className,
  children,
  ...props
}: InputRightElementProps) {
  return (
    <span
      className={twMerge(
        "flex items-center text-text-tertiary ml-auto",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Input, InputIcon, InputLabel, InputRightElement, inputVariants };

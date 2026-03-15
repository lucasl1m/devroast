import * as Switch from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const toggleVariants = tv({
  base: "peer inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page disabled:cursor-not-allowed disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-border-primary data-[state=checked]:bg-accent-green",
    },
    size: {
      default: "h-[22px] w-[40px] p-1",
      sm: "h-[18px] w-[32px] p-0.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const toggleKnobVariants = tv({
  base: "pointer-events-none block rounded-full bg-text-secondary transition-transform duration-100",
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-3 w-3",
    },
  },
  compoundVariants: [
    {
      size: "default",
      className:
        "data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0",
    },
    {
      size: "sm",
      className:
        "data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0",
    },
  ],
  defaultVariants: {
    size: "default",
  },
});

type ToggleVariant = NonNullable<
  VariantProps<typeof toggleVariants>["variant"]
>;
type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>["size"]>;

export interface ToggleProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Switch.Root>,
    "className"
  > {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
}

export type { ToggleSize, ToggleVariant };

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: ToggleProps) {
  return (
    <Switch.Root
      className={twMerge(toggleVariants({ variant, size, className }))}
      {...props}
    >
      <Switch.Thumb
        className={twMerge(
          toggleKnobVariants({ size }),
          "data-[state=checked]:bg-neutral-900"
        )}
      />
    </Switch.Root>
  );
}

export { Toggle, toggleVariants };

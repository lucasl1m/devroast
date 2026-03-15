import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const navLinkVariants = tv({
  base: "font-mono text-sm transition-colors hover:text-text-primary",
  variants: {
    variant: {
      default: "text-text-secondary",
      active: "text-text-primary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Navbar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav
      className={twMerge(
        "flex items-center justify-between h-14 px-10 border-b border-border-primary bg-bg-page",
        className
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="text-accent-green font-mono text-xl font-bold">
          &gt;
        </span>
        <span className="text-text-primary font-mono text-lg font-medium">
          devroast
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/leaderboard" className={navLinkVariants()}>
          leaderboard
        </Link>
      </div>
    </nav>
  );
}

export { Navbar };

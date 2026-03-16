import { twMerge } from "tailwind-merge";
import type { LeaderboardEntry } from "@/data/leaderboard";

export interface LeaderboardEntryCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  entry: LeaderboardEntry;
}

function LeaderboardEntryCardRoot({
  className,
  entry,
  ...props
}: LeaderboardEntryCardProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col rounded-md border border-border-primary bg-bg-surface overflow-hidden",
        className
      )}
      {...props}
    >
      {props.children}
    </div>
  );
}

function LeaderboardEntryCardMeta({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between h-12 px-5 border-b border-border-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function LeaderboardEntryCardRank({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge("font-mono text-sm font-medium", className)}
      {...props}
    >
      {children}
    </span>
  );
}

function LeaderboardEntryCardUsername({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge("font-mono text-sm text-text-primary", className)}
      {...props}
    >
      {children}
    </span>
  );
}

function LeaderboardEntryCardScore({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={twMerge("font-mono text-sm text-text-secondary", className)}
      {...props}
    >
      {children}
    </span>
  );
}

function LeaderboardEntryCardCode({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge("h-[120px] overflow-auto bg-bg-input", className)}
      {...props}
    />
  );
}

const LeaderboardEntryCard = Object.assign(LeaderboardEntryCardRoot, {
  Meta: LeaderboardEntryCardMeta,
  Rank: LeaderboardEntryCardRank,
  Username: LeaderboardEntryCardUsername,
  Score: LeaderboardEntryCardScore,
  Code: LeaderboardEntryCardCode,
});

export { LeaderboardEntryCard };

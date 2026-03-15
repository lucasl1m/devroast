import { twMerge } from "tailwind-merge";

export interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  className?: string;
}

function ScoreRing({
  score,
  maxScore = 10,
  size = 180,
  className,
}: ScoreRingProps) {
  const percentage = Math.min(Math.max(score / maxScore, 0), 1);
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage);

  const getColor = (s: number) => {
    if (s >= 7) return "text-accent-green";
    if (s >= 4) return "text-accent-amber";
    return "text-accent-red";
  };

  return (
    <div
      className={twMerge(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Outer ring */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-label="Score ring background"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-primary)"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Gradient arc */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-label="Score ring progress"
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-green)" />
            <stop offset="35%" stopColor="var(--accent-amber)" />
            <stop offset="36%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center text */}
      <div className="flex items-baseline gap-0.5">
        <span
          className={twMerge(
            "font-mono text-5xl font-bold leading-none",
            getColor(score)
          )}
        >
          {score.toFixed(1)}
        </span>
        <span className="font-mono text-base text-text-tertiary">/10</span>
      </div>
    </div>
  );
}

export { ScoreRing };

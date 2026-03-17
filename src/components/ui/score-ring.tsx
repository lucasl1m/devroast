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
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage);

  const getScoreColor = (s: number) => {
    if (s >= 4) return "var(--accent-green)";
    if (s >= 2) return "var(--accent-amber)";
    return "var(--accent-red)";
  };

  const getScoreColorClass = (s: number) => {
    if (s >= 4) return "text-accent-green";
    if (s >= 2) return "text-accent-amber";
    return "text-accent-red";
  };

  const scoreColor = getScoreColor(score);
  const scoreColorClass = getScoreColorClass(score);

  return (
    <div
      className={twMerge(
        "relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Outer ring - background */}
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

      {/* Progress ring */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-label="Score ring progress"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
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
            scoreColorClass
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

"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import { trpc } from "@/server/trpc/client";

export function HomeStats() {
  const { data: stats } = trpc.getStats.useQuery();
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayAvg, setDisplayAvg] = useState(0);

  useEffect(() => {
    if (stats) {
      setDisplayTotal(stats.totalRoasted);
      setDisplayAvg(stats.avgScore);
    }
  }, [stats]);

  return (
    <div className="flex items-center justify-center gap-1 font-code text-text-tertiary text-xs whitespace-nowrap">
      <span className="w-8 text-right">
        <NumberFlow
          value={displayTotal}
          className="text-text-tertiary"
          format={{ notation: "compact" }}
        />
      </span>
      <span>coded roasted</span>
      <span>·</span>
      <span>
        avg score:{" "}
        <span className="w-8 inline-block text-left">
          <NumberFlow
            value={displayAvg > 0 ? displayAvg : 0}
            className="text-text-tertiary"
            format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          />
        </span>
        /10
      </span>
    </div>
  );
}

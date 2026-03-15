"use server";

import { getLeaderboard, getStats } from "@/db/queries/submissions";

export async function fetchHomepageData() {
  const [stats, leaderboard] = await Promise.all([
    getStats(),
    getLeaderboard(3, 0),
  ]);

  return {
    stats: {
      totalRoasted: stats.totalRoasted,
      avgScore: stats.avgScore,
    },
    leaderboard: leaderboard.map((item) => ({
      rank: 0,
      id: item.id,
      code: item.code.substring(0, 50) + "...",
      lang: item.language,
      score: parseFloat(item.score || "0"),
    })),
  };
}

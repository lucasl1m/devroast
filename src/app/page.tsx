import { fetchHomepageData } from "@/app/actions/homepage";
import HomepageClient from "./homepage-client";

interface LeaderboardItem {
  rank: number;
  id: string;
  code: string;
  lang: string;
  score: number;
}

interface HomepageStats {
  totalRoasted: number;
  avgScore: number;
}

interface HomepageData {
  stats: HomepageStats;
  leaderboard: LeaderboardItem[];
}

export default async function HomePage() {
  let homepageData: HomepageData = {
    stats: { totalRoasted: 0, avgScore: 0 },
    leaderboard: [],
  };

  try {
    homepageData = await fetchHomepageData();
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
  }

  return <HomepageClient initialData={homepageData} />;
}

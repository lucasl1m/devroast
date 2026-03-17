import { HomeEditor } from "@/app/home-editor";
import { HomeLeaderboard } from "@/app/home-leaderboard";
import { HomeStats } from "@/components/home-stats";
import { HydrateClient, trpc } from "@/server/trpc/server";

export default async function HomePage() {
  await trpc.getStats.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-bg-page">
        <div className="w-full max-w-[1440px] mx-auto px-10 pt-[80px]">
          {/* Hero Title - Centralizado */}
          <div className="w-[660px] mx-auto flex flex-col gap-3 mb-12 text-center">
            <h1 className="flex items-center justify-center gap-3 text-[36px] font-bold font-mono">
              <span className="text-accent-green">$</span>
              <span className="text-text-primary">
                paste your code. get roasted.
              </span>
            </h1>
            <p className="font-code text-text-secondary text-sm">
              {"//"} drop your code below and we&apos;ll rate it — brutally
              honest or full roast mode
            </p>
          </div>

          <HomeEditor />

          {/* Footer Hint - Centralizado */}
          <div className="w-[316px] mx-auto mb-[60px]">
            <HomeStats />
          </div>

          {/* Leaderboard Preview - Centralizado */}
          <HomeLeaderboard />
        </div>
      </main>
    </HydrateClient>
  );
}

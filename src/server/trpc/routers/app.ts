import { getStats as getStatsDb } from "@/db/queries/submissions";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    return getStatsDb();
  }),
});

export type AppRouter = typeof appRouter;

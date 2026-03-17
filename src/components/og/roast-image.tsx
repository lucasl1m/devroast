import { getSubmissionById } from "@/db/queries/submissions";

interface RoastImageProps {
  id: string;
}

function getBadgeVariant(score: number): { label: string; color: string; bgColor: string } {
  if (score < 2) {
    return { label: "needs_serious_help", color: "#EF4444", bgColor: "#FEE2E2" };
  }
  if (score < 4) {
    return { label: "could_be_better", color: "#F59E0B", bgColor: "#FEF3C7" };
  }
  return { label: "not_bad", color: "#22C55E", bgColor: "#DCFCE7" };
}

export async function generateRoastImage(id: string) {
  const submission = await getSubmissionById(id);
  if (!submission) {
    throw new Error("Roast not found");
  }

  const analysis = submission.analysis as { score: number; verdict: string } | null;
  const score = analysis?.score ?? 0;
  const badge = getBadgeVariant(score);
  const language = submission.language;
  const lineCount = submission.lineCount ?? 1;
  const verdict = analysis?.verdict ?? "no verdict";

  return {
    score,
    badge,
    language,
    lineCount,
    verdict,
  };
}

export function RoastImage({
  score,
  badge,
  language,
  lineCount,
  verdict,
}: {
  score: number;
  badge: { label: string; color: string; bgColor: string };
  language: string;
  lineCount: number;
  verdict: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        padding: "64px",
        backgroundColor: "#0A0A0A",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#22C55E", fontSize: "24px", fontWeight: "700" }}>&gt;</span>
        <span style={{ color: "#FAFAFA", fontSize: "20px", fontWeight: "500" }}>devroast</span>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ color: "#F59E0B", fontSize: "160px", fontWeight: "900", lineHeight: 1 }}>
          {score.toFixed(1)}
        </span>
        <span style={{ color: "#525252", fontSize: "56px", fontWeight: "400", lineHeight: 1 }}>
          /10
        </span>
      </div>

      {/* Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: badge.color,
          }}
        />
        <span style={{ color: badge.color, fontSize: "20px", fontWeight: "400" }}>
          {badge.label}
        </span>
      </div>

      {/* Lang + Lines */}
      <span style={{ color: "#525252", fontSize: "16px", fontFamily: "monospace" }}>
        lang: {language} · {lineCount} lines
      </span>

      {/* Quote */}
      <p
        style={{
          color: "#FAFAFA",
          fontSize: "22px",
          fontFamily: "monospace",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "100%",
        }}
      >
        "{verdict}"
      </p>
    </div>
  );
}

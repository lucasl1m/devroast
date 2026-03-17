"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { ScoreRing } from "@/components/ui/score-ring";
import { highlightCode } from "@/lib/highlighter";
import { languageAliases } from "@/lib/languages";
import { trpc } from "@/server/trpc/client";

type AnalysisFeedback = {
  severity: string;
  title: string;
  message: string;
};

type AnalysisDiff = {
  type: "added" | "removed" | "context";
  content: string;
  lineNumber?: number | null;
};

type Analysis = {
  score: number;
  verdict: string;
  feedbacks: AnalysisFeedback[];
  diff: AnalysisDiff[];
} | null;

interface CodeBlockContentProps {
  code: string;
  lang: string;
}

function CodeBlockContent({ code, lang }: CodeBlockContentProps) {
  const [html, setHtml] = useState("");
  const lines = code.split("\n");
  const normalizedLang = languageAliases[lang] || lang;

  useEffect(() => {
    async function highlight() {
      const result = await highlightCode({ code, lang: normalizedLang });
      setHtml(result);
    }
    highlight();
  }, [code, normalizedLang]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col border-r border-border-primary bg-bg-surface pr-3 pl-2 py-3 text-right text-text-tertiary select-none shrink-0">
        {lines.map((_, i) => (
          <span key={i} className="leading-6">
            {i + 1}
          </span>
        ))}
      </div>
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 leading-6 font-mono text-sm"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

interface DiffLineItem {
  lineNumber: number;
  variant: "added" | "removed" | "context";
  code: string;
}

interface DiffCodeContentProps {
  diffLines: DiffLineItem[];
}

function DiffCodeContent({ diffLines }: DiffCodeContentProps) {
  return (
    <div className="flex h-full">
      <div className="flex flex-col border-r border-border-primary bg-bg-surface pr-3 pl-2 py-3 text-right text-text-tertiary select-none shrink-0">
        {diffLines.map((_, i) => (
          <span key={i} className="leading-6">
            {i + 1}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {diffLines.map((line, i) => (
          <div
            key={i}
            className={`leading-6 font-mono text-sm whitespace-pre-wrap ${
              line.variant === "added"
                ? "bg-accent-green/10 text-accent-green"
                : line.variant === "removed"
                  ? "bg-accent-red/10 text-accent-red"
                  : "text-text-primary"
            }`}
          >
            {line.code}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoastResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: roast, isLoading, error } = trpc.getRoastById.useQuery({ id });
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-page flex items-center justify-center">
        <span className="font-mono text-accent-green">Loading...</span>
      </main>
    );
  }

  if (error || !roast) {
    return (
      <main className="min-h-screen bg-bg-page flex flex-col items-center justify-center gap-4">
        <h1 className="font-mono text-accent-red">Roast not found</h1>
        <Link href="/" className="font-mono text-accent-green">
          ← Back to home
        </Link>
      </main>
    );
  }

  const SAMPLE_CODE = roast.code;
  const analysis = roast.analysis as Analysis;
  const lineCount =
    (roast as any).line_count ??
    (roast as any).lineCount ??
    roast.code?.split("\n").length ??
    1;
  const language = roast.language;

  const getScoreColor = (s: number) => {
    if (s >= 3.5) return "text-accent-green";
    if (s >= 1) return "text-accent-amber";
    return "text-accent-red";
  };

  const scoreColorClass = getScoreColor(analysis?.score || 0);
  const severityLabel =
    (analysis?.score || 0) < 2
      ? "needs_serious_help"
      : (analysis?.score || 0) < 4
        ? "could_be_better"
        : "not_bad";

  const ISSUES =
    analysis?.feedbacks?.map(
      (
        f: AnalysisFeedback
      ): {
        type: "critical" | "warning" | "good" | "info";
        title: string;
        description: string;
      } => ({
        type: f.severity as "critical" | "warning" | "good" | "info",
        title: f.title,
        description: f.message,
      })
    ) || [];

  const DIFF_LINES =
    analysis?.diff?.map((d) => ({
      lineNumber: d.lineNumber ?? 0,
      variant: d.type as "added" | "removed" | "context",
      code: d.content,
    })) ?? [];

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto">
        <section className="flex items-center gap-12">
          <ScoreRing score={analysis?.score || 0} />
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${scoreColorClass.replace("text-", "bg-")}`}
              />
              <span
                className={`font-mono text-sm font-medium ${scoreColorClass}`}
              >
                verdict: {severityLabel}
              </span>
            </div>
            <h1 className="font-code text-xl leading-relaxed text-text-primary">
              {`"${analysis?.verdict || "no verdict"}"`}
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-text-tertiary">
                lang: {language}
              </span>
              <span className="text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                {lineCount} lines
              </span>
              <Button
                variant="secondary"
                className="ml-auto px-4 py-2 text-xs font-mono"
                onClick={handleShare}
              >
                $ share_roast
              </Button>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <h2 className="font-mono text-sm font-bold text-text-primary">
              your_submission
            </h2>
          </div>
          <CodeBlock className="h-[424px]">
            <CodeBlock.Header
              filename={`code.${language === "typescript" ? "ts" : language}`}
            />
            <CodeBlockContent code={SAMPLE_CODE} lang={language} />
          </CodeBlock>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <h2 className="font-mono text-sm font-bold text-text-primary">
              detailed_analysis
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {ISSUES.map(
              (
                issue: {
                  type: "critical" | "warning" | "good" | "info";
                  title: string;
                  description: string;
                },
                index: number
              ) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-5 rounded-md border border-border-primary"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={issue.type}>{issue.type}</Badge>
                  </div>
                  <h3 className="font-mono text-sm font-medium text-text-primary">
                    {issue.title}
                  </h3>
                  <p className="font-code text-xs text-text-secondary leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <h2 className="font-mono text-sm font-bold text-text-primary">
              suggested_fix
            </h2>
          </div>
          <CodeBlock className="h-[200px]">
            <CodeBlock.Header filename="improved_code.ts" />
            <DiffCodeContent diffLines={DIFF_LINES} />
          </CodeBlock>
        </section>
      </div>
    </main>
  );
}

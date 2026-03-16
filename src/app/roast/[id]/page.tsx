import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

export const metadata: Metadata = {
  title: "Roast Results | DevRoast",
  description: "Your code has been roasted",
};

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}

function calculateTax(total) {
  // TODO: handle tax calculation
  return total * 0.1;
}

function calculateCurrency(total) {
  // TODO: handle currency conversion
  return total;
}`;

const ISSUES: Array<{
  type: "critical" | "good";
  title: string;
  description: string;
}> = [
  {
    type: "critical",
    title: "using var instead of const/let",
    description:
      "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
  },
  {
    type: "critical",
    title: "imperative loop pattern",
    description:
      "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
  },
  {
    type: "good",
    title: "clear naming conventions",
    description:
      "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
  },
  {
    type: "good",
    title: "single responsibility",
    description:
      "the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
  },
];

const DIFF_LINES = [
  {
    variant: "context" as const,
    prefix: " ",
    code: "function calculateTotal(items) {",
  },
  { variant: "removed" as const, prefix: "- ", code: "  var total = 0;" },
  {
    variant: "removed" as const,
    prefix: "- ",
    code: "  for (var i = 0; i < items.length; i++) {",
  },
  {
    variant: "removed" as const,
    prefix: "- ",
    code: "    total = total + items[i].price;",
  },
  { variant: "removed" as const, prefix: "- ", code: "  }" },
  { variant: "removed" as const, prefix: "- ", code: "  return total;" },
  {
    variant: "added" as const,
    prefix: "+ ",
    code: "  return items.reduce((sum, item) => sum + item.price, 0);",
  },
  { variant: "context" as const, prefix: " ", code: "}" },
];

export default function RoastResultPage() {
  return (
    <main className="min-h-screen bg-bg-page">
      <div className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto">
        <section className="flex items-center gap-12">
          <ScoreRing score={3.5} />
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="font-mono text-sm font-medium text-accent-red">
                verdict: needs_serious_help
              </span>
            </div>
            <h1 className="font-code text-xl text-text-primary leading-relaxed">
              "this code looks like it was written during a power outage... in
              2005."
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-tertiary">
                lang: javascript
              </span>
              <span className="text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                7 lines
              </span>
              <Button
                variant="secondary"
                className="ml-auto px-4 py-2 text-xs font-mono"
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
          <div className="h-[424px] rounded-md border border-border-primary bg-bg-input overflow-hidden">
            <CodeBlock>
              <CodeBlock.Content code={SAMPLE_CODE} lang="javascript" />
            </CodeBlock>
          </div>
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
            {ISSUES.map((issue, index) => (
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
            ))}
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
          <div className="flex flex-col rounded-md border border-border-primary bg-bg-input overflow-hidden">
            <div className="flex items-center h-10 px-4 border-b border-border-primary">
              <span className="font-mono text-xs text-text-secondary">
                your_code.ts → improved_code.ts
              </span>
            </div>
            <div className="py-1">
              {DIFF_LINES.map((line, index) => (
                <DiffLine
                  key={index}
                  variant={line.variant}
                  prefix={line.prefix}
                  code={line.code}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

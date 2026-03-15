import { highlightCode } from "@/lib/highlighter";
import { languageAliases } from "@/lib/languages";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  lang = "javascript",
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const normalizedLang = languageAliases[lang] || lang;

  const html = await highlightCode({
    code,
    lang: normalizedLang,
  });

  const lineCount = code.split("\n").length;

  return (
    <div className="rounded-md border border-border-primary overflow-hidden bg-bg-input font-mono text-sm">
      <div className="flex items-center gap-3 border-b border-border-primary px-0 py-2">
        <div className="flex gap-1.5 pl-4">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
        </div>
        {filename && (
          <span className="ml-auto mr-4 text-xs text-text-tertiary">
            {filename}
          </span>
        )}
      </div>

      <div className="flex">
        {showLineNumbers && (
          <div className="flex flex-col border-r border-border-primary bg-bg-surface pr-3 pl-2 py-3 text-right text-text-tertiary select-none">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i} className="leading-6">
                {i + 1}
              </span>
            ))}
          </div>
        )}
        <div
          className="flex-1 overflow-x-auto p-3 leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

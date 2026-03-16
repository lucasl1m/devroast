import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { highlightCode } from "@/lib/highlighter";
import { languageAliases } from "@/lib/languages";

const codeBlockVariants = tv({
  base: "rounded-md border border-border-primary bg-bg-input",
});

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {}

function CodeBlockRoot({ className, children, ...props }: CodeBlockProps) {
  return (
    <div
      className={twMerge(codeBlockVariants({ className }), "h-full")}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CodeBlockHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  filename?: string;
}

function CodeBlockHeader({
  className,
  filename,
  ...props
}: CodeBlockHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-3 border-b border-border-primary px-0 py-2",
        className
      )}
      {...props}
    >
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
  );
}

export interface CodeBlockContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  lang?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlockContent({
  className,
  code,
  lang = "javascript",
  showLineNumbers = true,
  ...props
}: CodeBlockContentProps) {
  const normalizedLang = languageAliases[lang] || lang;

  const html = await highlightCode({
    code,
    lang: normalizedLang,
  });

  const lineCount = code.split("\n").length;

  return (
    <div className={twMerge("flex h-full", className)} {...props}>
      {showLineNumbers && (
        <div className="flex flex-col border-r border-border-primary bg-bg-surface pr-3 pl-2 py-3 text-right text-text-tertiary select-none shrink-0">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="leading-6">
              {i + 1}
            </span>
          ))}
        </div>
      )}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 leading-6 font-mono text-sm custom-scrollbar"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

const CodeBlock = Object.assign(CodeBlockRoot, {
  Header: CodeBlockHeader,
  Content: CodeBlockContent,
});

export { CodeBlock, codeBlockVariants };

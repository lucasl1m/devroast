"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { highlightCode } from "@/lib/highlighter";
import { languageAliases } from "@/lib/languages";

const codeBlockVariants = tv({
  base: "rounded-md border border-border-primary bg-bg-input",
});

export interface CodeBlockCollapsibleProps {
  code: string;
  lang?: string;
  maxLines?: number;
  threshold?: number;
  className?: string;
}

export function CodeBlockCollapsible({
  code,
  lang = "javascript",
  maxLines = 3,
  threshold = 3,
  className,
}: CodeBlockCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [html, setHtml] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");

  const lines = code.split("\n");
  const isLong = lines.length > threshold;

  useEffect(() => {
    async function highlight() {
      const normalizedLang = languageAliases[lang] || lang;
      const result = await highlightCode({ code, lang: normalizedLang });
      setHtml(result);
    }
    highlight();
  }, [code, lang]);

  useEffect(() => {
    async function highlightPreview() {
      const previewCode = lines.slice(0, maxLines).join("\n");
      const normalizedLang = languageAliases[lang] || lang;
      const result = await highlightCode({
        code: previewCode,
        lang: normalizedLang,
      });
      setPreviewHtml(result);
    }
    highlightPreview();
  }, [lang, maxLines, lines]);

  if (!isLong) {
    return (
      <div className={twMerge(codeBlockVariants({ className }))}>
        <div className="flex">
          <div className="flex flex-col border-r border-border-primary bg-bg-surface pr-3 pl-2 py-3 text-right text-text-tertiary select-none shrink-0">
            {lines.map((_, i) => (
              <span key={i} className="leading-6">
                {i + 1}
              </span>
            ))}
          </div>
          <div
            className="flex-1 p-3 leading-6 font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    );
  }

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className={twMerge(codeBlockVariants({ className }))}>
        <div className="flex">
          <div className="flex flex-col border-r border-border-primary bg-bg-surface pr-3 pl-2 py-3 text-right text-text-tertiary select-none shrink-0">
            {previewHtml
              ? lines.slice(0, maxLines).map((_, i) => (
                  <span key={i} className="leading-6">
                    {i + 1}
                  </span>
                ))
              : lines.slice(0, maxLines).map((_, i) => (
                  <span key={i} className="leading-6">
                    {i + 1}
                  </span>
                ))}
            {isOpen &&
              lines.slice(maxLines).map((_, i) => (
                <span key={i + maxLines} className="leading-6">
                  {i + maxLines + 1}
                </span>
              ))}
          </div>
          <div className="flex-1 p-3 leading-6 font-mono text-sm">
            {!isOpen ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            )}
          </div>
        </div>
        <Collapsible.Trigger className="flex w-full items-center justify-center py-2 text-xs font-mono text-accent-green hover:underline border-t border-border-primary bg-bg-surface">
          {isOpen
            ? "[-] collapse"
            : `[+] show ${lines.length - maxLines} more lines`}
        </Collapsible.Trigger>
      </div>
    </Collapsible.Root>
  );
}

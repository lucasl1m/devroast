"use client";

import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";
import {
  languageNames,
  type SupportedLanguage,
  supportedLanguages,
  useLanguageDetection,
} from "@/hooks/use-language-detection";
import { highlightCode } from "@/lib/highlighter";

const editorVariants = tv({
  base: "rounded-md border border-border-primary overflow-hidden bg-bg-input font-mono",
  variants: {
    variant: {
      default: "border-border-primary",
      error: "border-accent-red",
      success: "border-accent-green",
    },
    size: {
      default: "h-[360px]",
      sm: "h-[200px]",
      lg: "h-[480px]",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type CodeEditorVariant = NonNullable<
  VariantProps<typeof editorVariants>["variant"]
>;
export type CodeEditorSize = NonNullable<
  VariantProps<typeof editorVariants>["size"]
>;

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  variant?: CodeEditorVariant;
  size?: CodeEditorSize;
  language?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
  showLanguageSelector?: boolean;
  placeholder?: string;
  className?: string;
}

interface HighlightedCodeProps {
  code: string;
  language: SupportedLanguage;
}

function HighlightedCode({ code, language }: HighlightedCodeProps) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    highlightCode({ code, lang: language })
      .then(setHtml)
      .finally(() => setLoading(false));
  }, [code, language]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-bg-input text-text-secondary">
        <span className="text-sm">Highlighting...</span>
      </div>
    );
  }

  if (!html) return null;

  return (
    <div
      className="absolute inset-0 overflow-auto p-4 leading-6 [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0 [&>pre]:!bg-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function CodeEditor({
  value = "",
  onChange,
  variant = "default",
  size = "default",
  language: controlledLanguage,
  onLanguageChange,
  showLanguageSelector = true,
  placeholder = "Paste your code here...",
  className,
}: CodeEditorProps) {
  const { language, setLanguage, detectLanguage } = useLanguageDetection({
    defaultLanguage: controlledLanguage || "javascript",
    onLanguageChange,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
      detectLanguage(newValue);
    },
    [onChange, detectLanguage]
  );

  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  return (
    <div className={twMerge(editorVariants({ variant, size, className }))}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border-primary bg-bg-surface px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-accent-red" />
          <span className="h-3 w-3 rounded-full bg-accent-amber" />
          <span className="h-3 w-3 rounded-full bg-accent-green" />
        </div>

        {showLanguageSelector && (
          <select
            value={language}
            onChange={handleLanguageSelect}
            className="ml-auto rounded border border-border-primary bg-bg-input px-2 py-1 text-xs text-text-secondary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {languageNames[lang]}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Editor Container */}
      <div className="relative h-[calc(100%-44px)]">
        <HighlightedCode code={value} language={language} />

        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-accent-green p-4 leading-6 font-mono text-sm focus:outline-none placeholder:text-text-tertiary"
          spellCheck={false}
          style={{
            lineHeight: "1.5rem",
          }}
        />
      </div>
    </div>
  );
}

export type { CodeEditorSize, CodeEditorVariant };
export { CodeEditor, editorVariants };

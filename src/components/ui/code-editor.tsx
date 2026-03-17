"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import { highlightCode } from "@/lib/highlighter";
import {
  languageNames,
  type SupportedLanguage,
  supportedLanguages,
} from "@/lib/languages";

const MAX_CODE_LENGTH = 10000;

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
  maxLength?: number;
  onLimitChange?: (isOverLimit: boolean) => void;
}

function HighlightedCode({
  code,
  language,
  scrollRef,
}: {
  code: string;
  language: SupportedLanguage | null;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!language || !code.trim()) {
      return;
    }

    let cancelled = false;
    highlightCode({ code, lang: language }).then((result) => {
      if (!cancelled) {
        setHtml(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  if (!language || !code.trim()) {
    return (
      <div
        ref={scrollRef}
        className={twMerge(
          "absolute inset-0 whitespace-pre-wrap break-all px-4 py-4 text-base leading-[22.5px] text-text-tertiary font-mono overflow-y-auto overflow-x-hidden"
        )}
      >
        {code || ""}
      </div>
    );
  }

  if (!html) {
    return (
      <div
        ref={scrollRef}
        className={twMerge(
          "absolute inset-0 whitespace-pre-wrap break-all px-4 py-4 text-base leading-[22.5px] text-text-tertiary font-mono overflow-y-auto overflow-x-hidden"
        )}
      >
        {code || ""}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="absolute inset-0 whitespace-pre-wrap break-all px-4 py-4 text-base leading-[22.5px] font-mono pointer-events-none overflow-y-auto overflow-x-hidden"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function CodeEditor({
  value = "",
  onChange,
  variant = "default",
  size = "default",
  onLanguageChange,
  showLanguageSelector = true,
  placeholder = "Paste your code here...",
  className,
  maxLength = MAX_CODE_LENGTH,
  onLimitChange,
}: CodeEditorProps) {
  const { language, setLanguage, detectLanguage } = useLanguageDetection({
    onLanguageChange,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);
  const isOverLimit = value.length > maxLength;

  useEffect(() => {
    onLimitChange?.(isOverLimit);
  }, [isOverLimit, onLimitChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
      detectLanguage(newValue);
    },
    [onChange, detectLanguage]
  );

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightedRef.current) {
      highlightedRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightedRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div className={twMerge(editorVariants({ variant, size, className }))}>
      {/* Header */}
      <div className="flex items-center justify-between h-8 px-4 border-b border-border-primary bg-bg-surface shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent-red" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
        </div>
        <div className="flex items-center gap-2">
          {showLanguageSelector && (
            <select
              value={language || ""}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="rounded border border-border-primary bg-bg-input px-2 py-0.5 text-xs text-text-secondary focus:border-accent-green focus:outline-none"
            >
              <option value="" disabled>
                Auto
              </option>
              {supportedLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {languageNames[lang]}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="relative h-[calc(100%-56px)] overflow-hidden">
        <HighlightedCode
          code={value}
          language={language}
          scrollRef={highlightedRef}
        />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={handleScroll}
          placeholder={placeholder}
          className={twMerge(
            "absolute inset-0 w-full h-full resize-none bg-transparent caret-accent-green px-4 py-4 font-mono text-base leading-[22.5px] placeholder:text-text-tertiary whitespace-pre-wrap break-all overflow-y-auto overflow-x-hidden",
            "z-10 [-webkit-text-fill-color:transparent] focus:outline-none"
          )}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
        />
      </div>

      {/* Character Counter */}
      <div className="flex items-center justify-end h-6 px-4 border-t border-border-primary bg-bg-surface shrink-0">
        <span
          className={twMerge(
            "font-mono text-xs",
            isOverLimit ? "text-accent-red" : "text-text-tertiary"
          )}
        >
          {value.length.toLocaleString("en-US")} /{" "}
          {maxLength.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}

export { CodeEditor, editorVariants };

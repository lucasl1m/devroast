import { useCallback, useMemo, useState } from "react";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

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
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLanguageSelector?: boolean;
  placeholder?: string;
  className?: string;
}

const webLanguages = [
  "javascript",
  "typescript",
  "html",
  "css",
  "scss",
  "json",
];

const popularLanguages = [
  "python",
  "go",
  "rust",
  "java",
  "csharp",
  "php",
  "sql",
  "shell",
  "yaml",
];

const supportedLanguages = [...webLanguages, ...popularLanguages, "plaintext"];

const languageNames: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  go: "Go",
  rust: "Rust",
  java: "Java",
  csharp: "C#",
  php: "PHP",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  json: "JSON",
  yaml: "YAML",
  sql: "SQL",
  shell: "Shell",
  plaintext: "Plain Text",
};

export function detectLanguage(code: string): string {
  const trimmedCode = code.trim();

  if (!trimmedCode) return "plaintext";

  if (
    /^(import|export|const|let|var|function|class|interface|type)\s/m.test(
      trimmedCode
    )
  ) {
    if (
      /:\s*(string|number|boolean|any|void|never|unknown)\s*[=;,)]/m.test(
        trimmedCode
      ) ||
      /<\s*[A-Z][a-zA-Z]*\s*>/m.test(trimmedCode) ||
      /interface\s+\w+\s*[{]/m.test(trimmedCode) ||
      /type\s+\w+\s*=/m.test(trimmedCode)
    ) {
      return "typescript";
    }
    return "javascript";
  }

  if (
    /^(def|class|import|from|if __name__|print\(|elif)\s/m.test(trimmedCode)
  ) {
    return "python";
  }

  if (
    /^(fn|let\s+mut|use\s+\w+::|impl|struct|enum|pub|match)\s/m.test(
      trimmedCode
    )
  ) {
    return "rust";
  }

  if (/^(func|package|import|type|struct|interface)\s/m.test(trimmedCode)) {
    return "go";
  }

  if (
    /^(public|private|protected|class|interface|void|static|package)\s/m.test(
      trimmedCode
    )
  ) {
    if (/\.out\.print|mport java\./m.test(trimmedCode)) {
      return "java";
    }
    return "csharp";
  }

  if (/^\$\w+|<?php|mysqli_|echo\s+['"]/m.test(trimmedCode)) {
    return "php";
  }

  if (/^<!DOCTYPE|^<html|^<div|^<span/m.test(trimmedCode)) {
    return "html";
  }

  if (/^{\s*"|^\[\s*{/m.test(trimmedCode)) {
    try {
      JSON.parse(trimmedCode);
      return "json";
    } catch {
      // Not valid JSON
    }
  }

  if (/^\$\w+:/m.test(trimmedCode)) {
    return "scss";
  }

  if (
    /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/im.test(trimmedCode)
  ) {
    return "sql";
  }

  if (
    /^(#!\/bin\/(bash|sh)|echo|export|if\s+\[|for\s+\w+\s+in)\s/m.test(
      trimmedCode
    )
  ) {
    return "shell";
  }

  return "plaintext";
}

interface HighlightedCodeProps {
  code: string;
  language: string;
}

async function HighlightedCode({ code, language }: HighlightedCodeProps) {
  const html = useMemo(() => {
    if (!code.trim()) return "";
    return codeToHtml(code, {
      lang: language === "plaintext" ? "text" : language,
      theme: "vesper",
    });
  }, [code, language]);

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
  const [internalLanguage, setInternalLanguage] = useState<string>(
    controlledLanguage || "javascript"
  );
  const [isLanguageManuallySelected, setIsLanguageManuallySelected] =
    useState(false);

  const language = controlledLanguage || internalLanguage;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (onChange) {
        onChange(newValue);
      }

      if (!isLanguageManuallySelected && newValue) {
        const detected = detectLanguage(newValue);
        if (detected !== language && detected !== "plaintext") {
          setInternalLanguage(detected);
        }
      }
    },
    [onChange, isLanguageManuallySelected, language]
  );

  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setIsLanguageManuallySelected(true);
    setInternalLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
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
                {languageNames[lang] || lang}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Editor Container */}
      <div className="relative h-[calc(100%-44px)]">
        {/* Syntax Highlighted Output */}
        <HighlightedCode code={value} language={language} />

        {/* Textarea for input (overlay) */}
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
export { CodeEditor, editorVariants, supportedLanguages };

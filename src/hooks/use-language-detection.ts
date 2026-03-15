import { useCallback, useState } from "react";
import type { SupportedLanguage } from "@/lib/languages";

interface LanguagePattern {
  pattern: RegExp;
  language: SupportedLanguage;
}

const languagePatterns: LanguagePattern[] = [
  // TypeScript (check before JavaScript due to more specific patterns)
  {
    pattern: /:\s*(string|number|boolean|any|void|never|unknown)\s*[=;,)]/m,
    language: "typescript",
  },
  {
    pattern: /<\s*[A-Z][a-zA-Z]*\s*>/m,
    language: "typescript",
  },
  {
    pattern: /interface\s+\w+\s*[{]/m,
    language: "typescript",
  },
  {
    pattern: /type\s+\w+\s*=/m,
    language: "typescript",
  },
  // JavaScript
  {
    pattern: /^(import|export|const|let|var|function|class|interface|type)\s/m,
    language: "javascript",
  },
  // Python
  {
    pattern: /^(def|class|import|from|if __name__|print\(|elif)\s/m,
    language: "python",
  },
  // Rust
  {
    pattern: /^(fn|let\s+mut|use\s+\w+::|impl|struct|enum|pub|match)\s/m,
    language: "rust",
  },
  // Go
  {
    pattern: /^(func|package|import|type|struct|interface)\s/m,
    language: "go",
  },
  // Java
  {
    pattern: /System\.out\.print|mport java\./m,
    language: "java",
  },
  // C#
  {
    pattern:
      /^(public|private|protected|class|interface|void|static|package)\s/m,
    language: "csharp",
  },
  // PHP
  {
    pattern: /^\$\w+|<?php|mysqli_|echo\s+['"]/m,
    language: "php",
  },
  // HTML
  {
    pattern: /^<!DOCTYPE|^<html|^<div|^<span/m,
    language: "html",
  },
  // SCSS
  {
    pattern: /^\$\w+:/m,
    language: "scss",
  },
  // SQL
  {
    pattern: /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/im,
    language: "sql",
  },
  // Shell
  {
    pattern: /^(#!\/bin\/(bash|sh)|echo|export|if\s+\[|for\s+\w+\s+in)\s/m,
    language: "shell",
  },
];

function detectLanguageByPattern(code: string): SupportedLanguage {
  const trimmedCode = code.trim();
  if (!trimmedCode) return "plaintext";

  // Check for JSON first (requires try-catch)
  if (/^{\s*"|^\[\s*{/m.test(trimmedCode)) {
    try {
      JSON.parse(trimmedCode);
      return "json";
    } catch {
      // Not valid JSON
    }
  }

  // Find first matching pattern
  for (const { pattern, language } of languagePatterns) {
    if (pattern.test(trimmedCode)) {
      return language;
    }
  }

  return "plaintext";
}

interface UseLanguageDetectionOptions {
  defaultLanguage?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

interface UseLanguageDetectionReturn {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  detectLanguage: (code: string) => void;
}

export function useLanguageDetection({
  defaultLanguage = "javascript",
  onLanguageChange,
}: UseLanguageDetectionOptions = {}): UseLanguageDetectionReturn {
  const [language, setLanguageState] =
    useState<SupportedLanguage>(defaultLanguage);
  const [isManuallySelected, setIsManuallySelected] = useState(false);

  const setLanguage = useCallback(
    (lang: SupportedLanguage) => {
      setIsManuallySelected(true);
      setLanguageState(lang);
      onLanguageChange?.(lang);
    },
    [onLanguageChange]
  );

  const detectLanguage = useCallback(
    (code: string) => {
      if (isManuallySelected) return;

      const detected = detectLanguageByPattern(code);
      if (detected !== "plaintext" && detected !== language) {
        setLanguageState(detected);
      }
    },
    [isManuallySelected, language]
  );

  return {
    language,
    setLanguage,
    detectLanguage,
  };
}

export { detectLanguageByPattern };

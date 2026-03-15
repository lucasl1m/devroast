import { useCallback, useState } from "react";

export const webLanguages = [
  "javascript",
  "typescript",
  "html",
  "css",
  "scss",
  "json",
] as const;

export const popularLanguages = [
  "python",
  "go",
  "rust",
  "java",
  "csharp",
  "php",
  "sql",
  "shell",
  "yaml",
] as const;

export const supportedLanguages = [
  ...webLanguages,
  ...popularLanguages,
  "plaintext",
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageNames: Record<SupportedLanguage, string> = {
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

function detectLanguageByPattern(code: string): SupportedLanguage {
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

interface UseLanguageDetectionOptions {
  defaultLanguage?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
}

interface UseLanguageDetectionReturn {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  detectLanguage: (code: string) => void;
  isManuallySelected: boolean;
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
    isManuallySelected,
  };
}

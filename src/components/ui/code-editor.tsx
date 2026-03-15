import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

const editorVariants = tv({
  base: "rounded-md border border-border-primary overflow-hidden bg-bg-input",
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
  onChange?: (value: string | undefined) => void;
  variant?: CodeEditorVariant;
  size?: CodeEditorSize;
  language?: string;
  onLanguageChange?: (language: string) => void;
  showLanguageSelector?: boolean;
  className?: string;
}

const languages = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "ruby", name: "Ruby" },
  { id: "php", name: "PHP" },
  { id: "swift", name: "Swift" },
  { id: "kotlin", name: "Kotlin" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "scss", name: "SCSS" },
  { id: "json", name: "JSON" },
  { id: "yaml", name: "YAML" },
  { id: "markdown", name: "Markdown" },
  { id: "sql", name: "SQL" },
  { id: "shell", name: "Shell" },
  { id: "plaintext", name: "Plain Text" },
];

function detectLanguage(code: string): string {
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
    /^(public|private|protected|class|interface|void|static|package)\s/m.test(
      trimmedCode
    )
  ) {
    if (
      /System\.out\.print/m.test(trimmedCode) ||
      /import java\./m.test(trimmedCode)
    ) {
      return "java";
    }
    return "csharp";
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

  if (/^<!DOCTYPE|^<html|^<div|^<span/m.test(trimmedCode)) {
    return "html";
  }

  if (
    /^{\s*"|^\[\s*{/m.test(trimmedCode) ||
    /^\s*{[\s\S]*}\s*$/m.test(trimmedCode)
  ) {
    try {
      JSON.parse(trimmedCode);
      return "json";
    } catch {
      // Not valid JSON
    }
  }

  if (
    /^(#!\/bin\/(bash|sh)|echo|export|if\s+\[|for\s+\w+\s+in)\s/m.test(
      trimmedCode
    )
  ) {
    return "shell";
  }

  if (
    /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/im.test(trimmedCode)
  ) {
    return "sql";
  }

  if (/^\$\w+|<?php|mysqli_|echo\s+['"]/m.test(trimmedCode)) {
    return "php";
  }

  if (
    /^(import|export)\s.*\sfrom\s+["']/m.test(trimmedCode) ||
    /\.scss$|\.sass$|\$\w+:/m.test(trimmedCode)
  ) {
    return "scss";
  }

  return "plaintext";
}

function CodeEditor({
  value = "",
  onChange,
  variant = "default",
  size = "default",
  language: controlledLanguage,
  onLanguageChange,
  showLanguageSelector = true,
  className,
}: CodeEditorProps) {
  const [internalLanguage, setInternalLanguage] = useState<string>(
    controlledLanguage || "javascript"
  );
  const [isLanguageManuallySelected, setIsLanguageManuallySelected] =
    useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const language = controlledLanguage || internalLanguage;

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      monaco.editor.setTheme("vs-dark");

      if (!isLanguageManuallySelected && value) {
        const detected = detectLanguage(value);
        setInternalLanguage(detected);
      }
    },
    [value, isLanguageManuallySelected]
  );

  const handleChange = useCallback(
    (newValue: string | undefined) => {
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
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Editor */}
      <Editor
        height="calc(100% - 44px)"
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="devroast-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
        }}
        loading={
          <div className="flex h-full items-center justify-center bg-bg-input text-text-secondary">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}

export type { CodeEditorSize, CodeEditorVariant };
export { CodeEditor, detectLanguage, editorVariants, languages };

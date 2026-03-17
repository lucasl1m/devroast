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
  "cpp",
  "ruby",
  "swift",
  "kotlin",
  "markdown",
  "bash",
  "other",
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
  cpp: "C++",
  ruby: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
  markdown: "Markdown",
  bash: "Bash",
  other: "Other",
};

export const languageAliases: Partial<Record<string, SupportedLanguage>> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "shell",
  yml: "yaml",
};

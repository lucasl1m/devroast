import {
  languageNames,
  type SupportedLanguage,
  supportedLanguages,
} from "@/lib/languages";

const languageIcons: Record<SupportedLanguage, string> = {
  javascript: "JS",
  typescript: "TS",
  python: "PY",
  go: "GO",
  rust: "RS",
  java: "JV",
  csharp: "C#",
  php: "PHP",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  json: "JSON",
  yaml: "YAML",
  sql: "SQL",
  shell: "SH",
  plaintext: "TXT",
};

interface EditorHeaderProps {
  language?: SupportedLanguage;
  onLanguageChange?: (language: SupportedLanguage) => void;
  showLanguageSelector?: boolean;
  filename?: string;
}

function EditorHeader({
  language,
  onLanguageChange,
  showLanguageSelector = true,
  filename,
}: EditorHeaderProps) {
  const handleLanguageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChange?.(e.target.value as SupportedLanguage);
  };

  return (
    <div className="flex items-center gap-3 border-b border-border-primary bg-bg-surface px-4 py-2">
      <div className="flex gap-1.5">
        <span className="h-3 w-3 rounded-full bg-accent-red" />
        <span className="h-3 w-3 rounded-full bg-accent-amber" />
        <span className="h-3 w-3 rounded-full bg-accent-green" />
      </div>

      {filename && (
        <span className="ml-auto mr-4 text-xs text-text-tertiary">
          {filename}
        </span>
      )}

      {showLanguageSelector && !filename && (
        <select
          value={language}
          onChange={handleLanguageSelect}
          className="ml-auto flex items-center gap-2 rounded border border-border-primary bg-bg-input px-2 py-1 text-xs text-text-secondary focus:border-accent-green focus:outline-none focus:ring-1 focus:ring-accent-green"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {languageIcons[lang]} {languageNames[lang]}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export type { EditorHeaderProps };
export { EditorHeader };

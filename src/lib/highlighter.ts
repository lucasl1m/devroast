import { codeToHtml } from "shiki";

export interface HighlightOptions {
  code: string;
  lang: string;
  theme?: string;
}

export async function highlightCode({
  code,
  lang,
  theme = "vesper",
}: HighlightOptions): Promise<string> {
  if (!code.trim()) return "";

  const normalizedLang = lang === "plaintext" ? "text" : lang;

  const html = await codeToHtml(code, {
    lang: normalizedLang,
    theme,
  });

  return html;
}

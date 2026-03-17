"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  CodeEditor,
  type SupportedLanguage,
  Toggle,
} from "@/components/ui";
import { trpc } from "@/server/trpc/client";

export function HomeEditor() {
  const router = useRouter();
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");
  const [isOverLimit, setIsOverLimit] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>("typescript");

  const createRoast = trpc.createRoast.useMutation({
    onSuccess: (data) => {
      router.push(`/roast/${data.id}`);
    },
  });

  return (
    <>
      {/* Code Editor - Centralizado */}
      <div className="w-[780px] mx-auto mb-6">
        <CodeEditor
          value={code}
          onChange={setCode}
          onLimitChange={setIsOverLimit}
          onLanguageChange={(lang) => setLanguage(lang as typeof language)}
          language={language}
          size="default"
        />
      </div>

      {/* Actions Bar - Centralizado */}
      <div className="w-[780px] mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-[10px]">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
            <span
              className={`font-mono text-sm ${
                roastMode ? "text-accent-green" : "text-text-secondary"
              }`}
            >
              roast mode
            </span>
          </div>
          <span className="font-code text-text-tertiary text-xs">
            {"//"} maximum sarcasm enabled
          </span>
        </div>

        <Button
          variant="primary"
          size="default"
          disabled={isOverLimit || !code.trim() || createRoast.isPending}
          onClick={() => {
            createRoast.mutate({
              code,
              language,
              roastMode: roastMode ? "full" : "light",
            });
          }}
        >
          $ roast_my_code
        </Button>
      </div>
    </>
  );
}

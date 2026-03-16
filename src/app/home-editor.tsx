"use client";

import { useState } from "react";
import { Button, CodeEditor, Toggle } from "@/components/ui";

export function HomeEditor() {
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");
  const [isOverLimit, setIsOverLimit] = useState(false);

  return (
    <>
      {/* Code Editor - Centralizado */}
      <div className="w-[780px] mx-auto mb-6">
        <CodeEditor
          value={code}
          onChange={setCode}
          onLimitChange={setIsOverLimit}
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

        <Button variant="primary" size="default" disabled={isOverLimit}>
          $ roast_my_code
        </Button>
      </div>
    </>
  );
}

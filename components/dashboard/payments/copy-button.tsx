"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast(" Failed to copy:" + err);
    }
  };

  return (
    <main className="flex items-center">
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={text}
            readOnly
            className="flex-1 border-none shadow-none"
          />
          <button onClick={handleCopy} className="h-auto p-0 text-xs font-mono">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </main>
  );
}

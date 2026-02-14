import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function SuccessFiled() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20" />
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </div>

      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        You're all set!
      </h2>
      <p className="mt-3 text-gray-500 max-w-sm leading-relaxed">
        Your profile is now complete. Our team will verify your documents within
        24 hours.
      </p>

      <div className="mt-10 w-full max-w-xs space-y-3">
        <Button asChild className="w-full " size="lg">
          <Link href="/dashboard">Enter Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

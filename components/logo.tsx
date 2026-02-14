import { Home } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Home className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-primary">HomeNest</span>
      </div>
    </Link>
  );
}

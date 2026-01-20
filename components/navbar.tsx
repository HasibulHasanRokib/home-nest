import { Button } from "@/components/ui/button";
import Logo from "./logo";
import Link from "next/link";
import { getCurrentUser } from "@/lib/get-current-user";
import { SignOut } from "@/app/auth/signout-button";

export async function Navbar() {
  const currentUser = await getCurrentUser();
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </div>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <SignOut />
              <Button size="sm">
                <Link href={"/dashboard"}>Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link href={"/auth/sign-in"}>Log In</Link>
              </Button>
              <Button size="sm">
                <Link href={"/auth/sign-up"}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

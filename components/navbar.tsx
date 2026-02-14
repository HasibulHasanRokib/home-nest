import Link from "next/link";
import { Logo } from "./logo";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { SignOut } from "@/app/auth/sign-out-btn";

export async function AuthButtons() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/sign-in">Log In</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <SignOut />
      <Button size="sm" asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}

export function AuthButtonsSkeleton() {
  return <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />;
}

export async function Navbar() {
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "How It Works", href: "/how-it-works" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Suspense fallback={<AuthButtonsSkeleton />}>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

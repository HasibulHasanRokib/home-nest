import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center  p-4 ">
      <div className="dark:bg-card w-full  overflow-hidden  bg-white ">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-destructive text-4xl font-bold">404</div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
              Page not found
            </h1>
            <p className="mb-6 text-slate-500">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex gap-4">
              <Button>
                <Link href="/">Go home</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="dark:border-card dark:bg-accent border-t border-slate-100 bg-slate-50 px-6 py-4 sm:px-8 sm:py-6">
          <p className="text-center text-xs text-slate-500">
            Try searching for what you&apos;re looking for or visit our
            homepage.
          </p>
        </div>
      </div>
    </div>
  );
}

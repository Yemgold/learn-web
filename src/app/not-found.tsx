

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-blue-600">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-slate-600">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="mt-8">
          <Link href="/">
            <Button size="lg">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
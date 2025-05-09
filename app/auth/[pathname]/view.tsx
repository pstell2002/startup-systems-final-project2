"use client";

import { AuthCard } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

export function AuthView({ pathname }: { pathname: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user && pathname === "sign-in") {
      router.replace("/dashboard");
    }
  }, [isPending, session, router, pathname]);

  useEffect(() => {
    if (pathname === "sign-out") {
      router.replace("/"); 
    }
  }, [pathname, router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-white">
    <div className="max-w-md w-full space-y-6 text-center">
      {reason === "signin" && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm">
          Please sign in to continue.
        </div>
      )}

      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <AuthCard pathname={pathname} />
        </div>
      </div>

      <p
        className={cn(
          ["callback", "settings", "sign-out"].includes(pathname) && "hidden",
          "text-xs text-gray-500"
        )}
      >
        Powered by{" "}
        <Link
          className="text-blue-600 underline hover:text-blue-800"
          href="https://better-auth.com"
          target="_blank"
        >
          better-auth
        </Link>
        .
      </p>
    </div>
  </main>
  );
}

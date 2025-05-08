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

  // ✅ Automatically redirect after sign-in
  useEffect(() => {
    if (!isPending && session?.user && pathname === "sign-in") {
      router.replace("/dashboard");
    }
  }, [isPending, session, router, pathname]);

  // ✅ Automatically redirect after sign-out
  useEffect(() => {
    if (pathname === "sign-out") {
      router.replace("/"); // redirect to home
    }
  }, [pathname, router]);

  return (
    <main className="flex grow flex-col items-center justify-center gap-3 p-4">
      {reason === "signin" && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm mb-4">
          Please sign in to continue.
        </div>
      )}

      <AuthCard pathname={pathname} />

      <p
        className={cn(
          ["callback", "settings", "sign-out"].includes(pathname) && "hidden",
          "text-muted-foreground text-xs"
        )}
      >
        Powered by{" "}
        <Link
          className="text-warning underline"
          href="https://better-auth.com"
          target="_blank"
        >
          better-auth
        </Link>
        .
      </p>
    </main>
  );
}

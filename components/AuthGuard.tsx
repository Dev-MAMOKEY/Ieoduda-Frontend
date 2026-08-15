"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { restoreAuthentication } from "@/lib/api/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let active = true;

    // 보호된 화면에 들어올 때 저장된 토큰으로 로그인 상태를 확인하거나 복구합니다.
    restoreAuthentication().then((authenticated) => {
      if (!active) return;
      setStatus(authenticated ? "authenticated" : "unauthenticated");
      // 사용할 수 있는 토큰이 없으면 보호된 화면 대신 로그인 화면으로 이동합니다.
      if (!authenticated) router.replace("/login");
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#f0f0f2] text-sm text-[#838383]">
        로그인 상태를 확인하고 있습니다.
      </main>
    );
  }

  if (status === "unauthenticated") return null;
  return children;
}

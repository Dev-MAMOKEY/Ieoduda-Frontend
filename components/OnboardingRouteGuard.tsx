"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getAccessTokenRole, restoreAuthentication } from "@/lib/api/auth";
import { getConsent, getMyPlan, getRoleChecks } from "@/lib/api/plan";
import { hasStoredTokens } from "@/lib/api/token-storage";

export function OnboardingRouteGuard({ children, current }: { children: ReactNode; current: "public" | "agreement" }) {
  const router = useRouter();
  const [checking, setChecking] = useState(hasStoredTokens);

  useEffect(() => {
    let active = true;
    if (!hasStoredTokens()) {
      queueMicrotask(() => active && setChecking(false));
      return () => { active = false; };
    }

    restoreAuthentication()
      .then(async (authenticated) => {
        if (!authenticated || !active) {
          setChecking(false);
          return;
        }

        const role = getAccessTokenRole();
        if (role === "ADMIN") {
          router.replace("/admin/evidence");
          return;
        }
        if (role === "EXTERNAL") {
          router.replace("/evidence");
          return;
        }

        const consent = await getConsent();
        if (!active) return;
        if (!consent.agreed) {
          if (current === "agreement") setChecking(false);
          else router.replace("/agreement");
          return;
        }

        const plan = await getMyPlan();
        const roles = await getRoleChecks(plan.planId);
        if (!active) return;
        router.replace(roles.some((role) => role.type === "CONFIRMER") ? "/plan" : "/verifier");
      })
      .catch(() => active && setChecking(false));

    return () => { active = false; };
  }, [current, router]);

  if (checking) {
    return <main className="flex min-h-dvh items-center justify-center text-sm text-[#838383]" role="status">이동할 화면을 확인하고 있습니다.</main>;
  }

  return children;
}

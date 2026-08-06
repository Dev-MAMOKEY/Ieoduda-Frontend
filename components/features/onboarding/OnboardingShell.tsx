// 안내 및 동의 단계에서 공통으로 사용하는 반응형 페이지 레이아웃을 제공합니다.
import type { ReactNode } from "react";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";

type OnboardingShellProps = {
  children: ReactNode;
};

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <main className="flex min-h-dvh justify-center bg-[#f0f0f2] lg:flex-col">
      <DesktopHeader authenticated />
      <section className="flex min-h-dvh w-full max-w-[390px] items-center justify-center px-6 py-[70px] lg:min-h-0 lg:max-w-none lg:flex-1 lg:px-[120px] lg:pb-[160px] lg:pt-0">
        {children}
      </section>
    </main>
  );
}

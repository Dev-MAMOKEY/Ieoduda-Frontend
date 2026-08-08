// 안내 및 동의 단계에서 공통으로 사용하는 반응형 페이지 레이아웃을 제공합니다.
import type { ReactNode } from "react";

// 온보딩 공통 레이아웃 안에 표시할 단계별 콘텐츠입니다.
type OnboardingShellProps = {
  children: ReactNode;
};

// 온보딩 화면에 공통 배경, 헤더, 콘텐츠 너비를 적용합니다.
export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <main className="flex min-h-dvh justify-center bg-[#f0f0f2] lg:flex-col">
      <section className="flex min-h-dvh w-full max-w-[390px] items-center justify-center px-6 py-[70px] lg:min-h-0 lg:max-w-none lg:flex-1 lg:px-[120px] lg:py-[70px]">
        {children}
      </section>
    </main>
  );
}

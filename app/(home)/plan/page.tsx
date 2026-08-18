"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BottomTabBar } from "@/components/BottomTabBar";
import { DesktopHeader } from "@/components/DesktopHeader";
import { getCurrentUser } from "@/lib/api";
import { getMyPlan, getOrderCheck } from "@/lib/api/plan";

const cards = [
  { title: "전달 메시지", description: "가족･친구･지인에게", status: "작성완료", icon: "/icons/plan-home/figma/message.svg", href: "/life-area" },
  { title: "관계 정리", description: "SNS 계정･부고 전달", status: "작성완료", icon: "/icons/plan-home/figma/relationship.svg", href: "/life-area" },
  { title: "업무 처리", description: "디자인 프로젝트 인수인계", status: "작성완료", icon: "/icons/plan-home/figma/work.svg", href: "/life-area" },
  { title: "확인자", description: "유지민･박성호", status: "등록완료", icon: "/icons/plan-home/figma/verifier.svg", href: "/verifier" },
];

export default function PlanPage() {
  const user = getCurrentUser();
  const [conflictCount, setConflictCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadConflictCount = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const plan = await getMyPlan();
      const order = await getOrderCheck(plan.planId);
      setConflictCount(order.items.filter((item) => item.conflict).length);
    } catch {
      setErrorMessage("미해결 충돌 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadConflictCount(), 0);
    return () => window.clearTimeout(timer);
  }, [loadConflictCount]);

  return (
    <main className="relative min-h-dvh w-full overflow-hidden text-[#28292e] md:!max-w-none md:!p-0">
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <Image src="/images/plan-home/mobile-background.png" alt="" fill priority sizes="(min-width: 768px) 1px, 100vw" className="object-cover md:hidden" />
        <Image src="/images/plan-home/desktop-background.png" alt="" fill priority sizes="(min-width: 768px) 100vw, 1px" className="hidden object-cover md:block" />
      </div>

      <section className="relative z-10 flex h-[262px] w-full flex-col items-center overflow-hidden rounded-b-[22px] px-6 md:h-[430px] md:px-0">
        <Image src="/images/plan-home/mobile-hero.png" alt="" fill priority sizes="(min-width: 768px) 1px, 100vw" className="object-cover md:hidden" />
        <Image src="/images/plan-home/desktop-hero.png" alt="" fill priority sizes="(min-width: 768px) 100vw, 1px" className="hidden object-cover md:block" />
        <p aria-hidden className="absolute left-1/2 top-[70px] -translate-x-1/2 whitespace-nowrap text-[148px] font-bold leading-none tracking-[-22.2px] text-white/15 md:top-[93px] md:text-[280px] md:tracking-[-42px]">ieoduda</p>

        <DesktopHeader authenticated showNavigation activeTab="home" />
        <div aria-hidden className="h-[59px] shrink-0 lg:hidden" />
        <header className="relative flex h-10 w-full shrink-0 items-center justify-center py-2 md:h-10 md:py-0">
          <h1 className="text-[18px] font-bold leading-none text-[#43306d] md:text-[20px]">홈</h1>
        </header>
        <div className="relative flex flex-1 flex-col items-center gap-3 pb-[46px] pt-10 text-[#43306d] md:gap-4 md:pb-[72px] md:pt-[70px]">
          <p className="text-[20px] font-bold leading-none text-[#3c2b62] md:text-[22px]">{user.name}님, 반가워요</p>
          <div className="flex flex-col items-center gap-[3px] text-[14px] leading-none md:gap-[6px] md:text-[18px]">
            <p className="font-semibold md:font-bold">지금은 계획 대기 중이예요</p>
            <p className="font-bold">평상시엔 아무 일도 일어나지 않아요</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto flex w-full max-w-[390px] flex-col gap-3 px-6 pb-[110px] pt-5 md:max-w-[460px] md:gap-10 md:px-0 md:pb-20 md:pt-[30px]">
        <div className="flex flex-col gap-3 md:gap-10">
          <Link href="/order" className="flex w-full items-center justify-between rounded-[16px] bg-[#f3f3ff] px-5 py-[14px] md:py-4">
            <span className="flex items-center gap-3 md:gap-[14px]">
              <span className="flex size-[38px] items-center justify-center rounded-full bg-[#e2dafa] md:size-[42px]"><Image src="/icons/plan-home/figma/warning.svg" alt="" width={24} height={24} className="size-[22px] md:size-6" /></span>
              <span className="flex flex-col gap-[6px]"><strong className="text-[14px] leading-none text-[#3c2b62] md:text-[16px]">미해결 충돌</strong><span className="text-[13px] font-medium leading-none text-[#584e4d] md:text-[15px]">{loading ? "확인 중" : `${conflictCount}건`}</span></span>
            </span>
            <Image src="/icons/common/caret-right.svg" alt="" width={18} height={18} className="size-[18px]" />
          </Link>
          {errorMessage && <button type="button" onClick={() => void loadConflictCount()} className="text-center text-xs text-red-700 underline">{errorMessage} 다시 시도</button>}
          <div className="h-px w-full bg-[#a99d9e]" />
        </div>

        <div className="flex flex-col gap-5 md:gap-6">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="flex items-center justify-between rounded-[16px] bg-[#fbfafd] px-4 py-5 md:px-5 md:py-[22px]">
              <span className="flex items-center gap-3 md:gap-[14px]"><span className="flex size-10 items-center justify-center rounded-[20px] bg-[#f3f3ff] md:size-[46px]"><Image src={card.icon} alt="" width={26} height={26} className="size-6 md:size-[26px]" /></span><span className="flex flex-col gap-[6px]"><strong className="text-[14px] leading-none text-[#43306d] md:text-[16px]">{card.title}</strong><span className="text-[13px] font-medium leading-none text-[#584e4d] md:text-[15px]">{card.description}</span></span></span>
              <span className="text-[12px] font-semibold leading-none text-[#796b6c] md:text-[14px]">{card.status}</span>
            </Link>
          ))}
        </div>
      </section>
      <BottomTabBar activeTab="home" />
    </main>
  );
}

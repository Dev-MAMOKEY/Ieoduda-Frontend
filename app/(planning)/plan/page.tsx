// 사용자의 계획 현황 카드와 모바일·데스크톱용 작업 버튼을 배치하는 홈 화면입니다.
import Image from "next/image";
import { PlanActions } from "@/components/features/planning/PlanActions";
import { PlanCard } from "@/components/features/planning/PlanCard";
import {
  primaryPlanCards,
  secondaryPlanCards,
} from "@/components/features/planning/data/planHomeCards";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";
import { BackButton } from "@/components/shared/ui/BackButton";

export default function PlanPage() {

  return (
    <main className="min-h-dvh bg-[#f0f0f2]">
      <DesktopHeader authenticated />

      <div className="mx-auto flex w-full max-w-[390px] flex-col gap-[22px] px-6 py-[70px] lg:max-w-none lg:gap-10 lg:px-[60px] lg:pb-[70px] lg:pt-0">
        <header className="flex w-full items-start justify-between pb-2.5 lg:h-7 lg:items-center lg:px-0 lg:pb-0">
          <BackButton />
          <h1 className="text-lg font-bold text-[#28292e] lg:text-xl">홈</h1>
          <span className="hidden size-7 lg:block" aria-hidden />
          <Image
            className="lg:hidden"
            src="/icons/plan/navigation/bell.svg"
            alt="알림"
            width={24}
            height={24}
          />
        </header>

        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[22px] lg:gap-10">
          <section className="flex flex-col items-center gap-3.5 pb-2.5 text-center lg:gap-4">
            <h2 className="text-xl font-bold text-[#28292e] lg:text-[22px]">
              김나무님, 반가워요
            </h2>
            <div className="flex flex-col gap-1 text-sm font-medium text-[#838383] lg:gap-1.5 lg:text-base">
              <p>지금은 계획 대기 중이예요</p>
              <p>평상시엔 아무 일도 일어나지 않아요</p>
            </div>
          </section>

          <PlanActions />

          <div className="grid w-full gap-[22px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-[26px]">
            <section className="flex flex-col gap-[22px]">
              {primaryPlanCards.map((card) => (
                <PlanCard key={card.title} {...card} />
              ))}
            </section>

            <section className="flex flex-col gap-[18px]">
              <div className="grid grid-cols-2 gap-[18px] lg:gap-[22px_18px]">
                {secondaryPlanCards.map((card) => (
                  <PlanCard key={card.title} {...card} compact />
                ))}
              </div>

              <PlanCard
                title="이의 제기 연락처 등록"
                description="010-1234-5678"
                status="등록 완료"
                icon="/icons/plan/cards/phone.svg"
              />

              <PlanActions desktop />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type PlanSummary = {
  userName?: string;
  conflictCount?: number;
  waitingPeriodDays?: number;
  managerAcceptance?: string;
  verifierCount?: number;
  backupManagerMissing?: boolean;
};

type ReleaseCase = {
  status?: string;
};

type DashboardData = {
  summary: PlanSummary;
  releaseCase: ReleaseCase;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

const cards = [
  { title: "전달 메시지", description: "가족·친구·지인에게", icon: "/icons/plan-home/asset-07.svg", href: "/life-area" },
  { title: "관계 정리", description: "SNS 계정·부고 전달", icon: "/icons/plan-home/asset-11.svg", href: "/life-area" },
  { title: "업무 처리", description: "디자인 프로젝트 인수인계", icon: "/icons/plan-home/asset-13.svg", href: "/life-area" },
  { title: "확인자", description: "유지민·박성호", icon: "/icons/plan-home/asset-15.svg", href: "/verifier" },
];

export default function PlanPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [summaryResponse, releaseResponse] = await Promise.all([
        fetch(`${apiBaseUrl}/api/plans/current/summary`, { credentials: "include", cache: "no-store" }),
        fetch(`${apiBaseUrl}/api/release-cases/current`, { credentials: "include", cache: "no-store" }),
      ]);

      if (!summaryResponse.ok || !releaseResponse.ok) throw new Error("dashboard request failed");

      const [summary, releaseCase] = await Promise.all([
        summaryResponse.json() as Promise<PlanSummary>,
        releaseResponse.json() as Promise<ReleaseCase>,
      ]);
      setData({ summary, releaseCase });
    } catch {
      setError("최신 계획 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDashboard(), 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const summary = data?.summary;
  const conflictCount = summary?.conflictCount ?? 0;

  return (
    <main className="min-h-dvh w-full bg-[#f1eff6]">
      <section className="relative mx-auto min-h-dvh w-full max-w-[390px] overflow-hidden bg-[#f1eff6] pb-[46px]">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 mx-auto max-w-[390px]">
          <Image src="/images/plan-raw-1.jpeg" alt="" fill priority sizes="390px" className="object-cover object-top" />
        </div>

        <div className="relative z-10">
          <header className="relative h-[262px] overflow-hidden rounded-b-[22px] px-6">
            <Image src="/images/plan-raw-4.jpeg" alt="" fill priority sizes="390px" className="object-cover" />
            <div aria-hidden="true" className="absolute left-1/2 top-[70px] -translate-x-1/2 text-[148px] font-bold leading-none tracking-[-22px] text-white/15">ieoduda</div>
            <div aria-hidden="true" className="relative h-[59px]" />
            <div className="relative flex h-10 items-center justify-center">
              <h1 className="text-[18px] font-bold leading-none text-[var(--purple-1)]">홈</h1>
            </div>
            <div className="relative flex flex-col items-center gap-3 pt-10">
              <p className="text-[20px] font-bold leading-none text-[#3c2b62]">{summary?.userName ?? "홍길동"}님, 반가워요</p>
              <div className="space-y-[3px] text-center text-[14px] leading-none text-[var(--purple-1)]">
                <p className="font-semibold">지금은 계획 대기 중이예요</p>
                <p className="font-bold">평상시엔 아무 일도 일어나지 않아요</p>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-3 px-6 pt-5">
            {error && (
              <div className="fixed left-1/2 top-[268px] z-30 flex w-[342px] -translate-x-1/2 items-center justify-between rounded-[14px] bg-red-50/95 px-4 py-2 text-xs text-red-700 shadow-sm">
                <span>{error} 표시된 정보가 최신이 아닐 수 있습니다.</span>
                <button type="button" onClick={() => void loadDashboard()} className="shrink-0 font-bold underline">재시도</button>
              </div>
            )}

            <Link href="/order" className="flex items-center justify-between rounded-[16px] bg-[#f3f3ff] px-5 py-[14px]">
              <span className="flex items-center gap-3">
                <span className="flex size-[38px] items-center justify-center rounded-full bg-[#e2dafa]">
                  <Image src="/icons/plan-home/asset-09.svg" alt="" width={22} height={22} />
                </span>
                <span className="flex flex-col gap-[6px]">
                  <strong className="text-[14px] leading-none text-[#3c2b62]">미해결 충돌</strong>
                  <span className="text-[13px] leading-none text-[var(--brown-1)]">{isLoading ? "확인 중" : `${conflictCount}건`}</span>
                </span>
              </span>
              <Image src="/icons/plan-home/asset-10.svg" alt="" width={18} height={18} />
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link href="/life-area" className="flex h-[45px] items-center justify-center rounded-[14px] bg-[#3c2b62] text-[14px] font-medium text-white">계획 수정하기</Link>
              <Link href="/manager" className="flex h-[45px] items-center justify-center rounded-[14px] bg-[#7f62b8] text-[14px] font-medium text-white">담당자 추가하기</Link>
            </div>

            <div className="flex flex-col gap-5">
              {cards.map((card) => (
                <Link key={card.title} href={card.href} className="flex items-center justify-between rounded-[16px] bg-[var(--white)] px-4 py-5">
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-[#f3f3ff]">
                      <Image src={card.icon} alt="" width={24} height={24} />
                    </span>
                    <span className="flex flex-col gap-[6px]">
                      <strong className="text-[14px] leading-none text-[var(--purple-1)]">{card.title}</strong>
                      <span className="text-[13px] leading-none text-[var(--brown-1)]">{card.description}</span>
                    </span>
                  </span>
                  <span className="text-[12px] font-semibold text-[var(--brown-2)]">작성완료</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <nav aria-label="주요 메뉴" className="fixed bottom-[25px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#e2dafa] bg-[var(--white)] p-[2px]">
          <Link href="/plan" aria-current="page" className="flex items-center gap-2 rounded-full bg-[#e2dafa] py-1 pl-[10px] pr-3 text-[13px] font-semibold text-[var(--purple-1)]">
            <Image src="/icons/plan-home/tab-home.svg" alt="" width={24} height={24} /> 홈
          </Link>
          <Link href="/handoff" aria-label="인계 점검" className="flex h-8 items-center justify-center rounded-full px-[10px]">
            <Image src="/icons/plan-home/tab-inspection.svg" alt="" width={24} height={24} />
          </Link>
          <Link href="/profile" aria-label="설정" className="flex h-8 items-center justify-center rounded-full px-[10px]">
            <Image src="/icons/plan-home/tab-settings.svg" alt="" width={24} height={24} />
          </Link>
        </nav>
      </section>
    </main>
  );
}

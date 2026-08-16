// 기본 계획과 삶의 구역별 항목을 각각 조회해 계획 홈에 표시하는 화면입니다.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Button } from "@/components/Button";
import { ForwardCaret } from "@/components/ForwardCaret";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import { getLifeAreas, getMyPlan, getOrderCheck } from "@/lib/api/plan";
import type { LifeAreaResponse, PlanResponse } from "@/lib/api/plan-types";

const categoryLabels = {
  FAMILY: "가족",
  RELATIONSHIP_CLEANUP: "관계 정리",
  WORK_CONTINUITY: "업무 인계",
} as const;

export default function PlanPage() {
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [areas, setAreas] = useState<LifeAreaResponse[]>([]);
  const [conflictCount, setConflictCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    // 먼저 내 계획을 조회한 후 받은 planId로 구역 항목과 충돌 정보를 각각 조회합니다.
    getMyPlan()
      .then(async (nextPlan) => {
        const [nextAreas, order] = await Promise.all([
          getLifeAreas(nextPlan.planId),
          getOrderCheck(nextPlan.planId),
        ]);
        if (!active) return;
        setPlan(nextPlan);
        setAreas(nextAreas);
        setConflictCount(order.items.filter((item) => item.conflict).length);
      })
      .catch((error) => active && setErrorMessage(getApiErrorMessage(error, "계획을 불러오지 못했습니다.")));
    return () => { active = false; };
  }, []);

  const items = areas.flatMap((area) => area.items.map((item) => ({ ...item, category: area.category })));

  return (
    <PageContainer className="items-center gap-[22px] pb-[100px] pt-[70px]">
      <PageHeader title="홈" className="pb-2.5" />
      <section className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-bold">나의 삶의 계획</h2>
        <p className="text-sm font-medium text-[#838383]">
          {plan ? `상태: ${plan.status} · 계획 #${plan.planId}` : "계획을 불러오는 중입니다."}
        </p>
      </section>
      {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
      <div className="flex w-full gap-5 py-1.5">
        <Button className="min-w-0 flex-1" href="/life-area">계획 작성·수정</Button>
        <Button className="min-w-0 flex-1" href="/manager">담당자 등록</Button>
      </div>
      <Link className="flex min-h-[60px] w-full items-center justify-between rounded-[20px] bg-[#d9d9d9] px-5 py-[18px]" href="/order">
        <strong>미해결 충돌</strong>
        <span className="flex items-center gap-1.5 text-sm text-[#838383]">{conflictCount}건 <ForwardCaret /></span>
      </Link>
      {items.length === 0 && plan && <p className="py-10 text-sm text-[#838383]">아직 작성된 계획 항목이 없습니다.</p>}
      {items.map((item) => (
        <article className="flex w-full flex-col gap-2 rounded-[20px] bg-white px-5 py-[18px]" key={item.itemId}>
          <span className="text-xs font-semibold text-[#838383]">{categoryLabels[item.category]}</span>
          <h3 className="text-base font-bold">{item.title}</h3>
          <p className="text-sm text-[#838383]">{item.content || item.action}</p>
          <span className="text-xs text-[#a8a8a8]">{item.status}</span>
        </article>
      ))}
      <BottomTabBar activeTab="home" />
    </PageContainer>
  );
}

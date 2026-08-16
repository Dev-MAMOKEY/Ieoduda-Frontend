// 계획 항목별 역할 담당자와 선택적인 대체 담당자를 일괄 등록하는 화면입니다.

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { OutlineButton } from "@/components/OutlineButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import { getLifeAreas, getMyPlan, registerRecipients } from "@/lib/api/plan";
import type { PlanItem } from "@/lib/api/plan-types";

export default function ManagerPage() {
  const router = useRouter();
  const [planId, setPlanId] = useState<number | null>(null);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [backups, setBackups] = useState<Set<number>>(new Set());
  const [waitingPeriods, setWaitingPeriods] = useState<Record<number, number | null>>({});
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 담당자를 계획 카드와 정확히 연결하기 위해 최신 삶의 구역 항목을 조회합니다.
    getMyPlan().then(async (plan) => {
      setPlanId(plan.planId);
      const areas = await getLifeAreas(plan.planId);
      setItems(areas.flatMap((area) => area.items));
    }).catch((error) => setErrorMessage(getApiErrorMessage(error, "계획 항목을 불러오지 못했습니다.")));
  }, []);

  const toggleBackup = (itemId: number) => setBackups((current) => {
    const next = new Set(current);
    if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
    return next;
  });

  // 같은 기간 버튼을 다시 누르면 선택을 해제하고, 다른 기간은 하나만 선택합니다.
  const toggleWaitingPeriod = (itemId: number, days: number) => {
    setWaitingPeriods((current) => ({
      ...current,
      [itemId]: current[itemId] === days ? null : days,
    }));
  };

  // 각 계획의 itemId와 담당자 입력값을 묶어 recipients 배열로 일괄 전송합니다.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || planId == null) return;
    const data = new FormData(event.currentTarget);
    const recipients = items.map((item) => {
      const backup = backups.has(item.itemId) ? { name: String(data.get(`${item.itemId}-backup-name`) ?? "").trim(), email: String(data.get(`${item.itemId}-backup-email`) ?? "").trim() } : undefined;
      return { itemId: item.itemId, name: String(data.get(`${item.itemId}-name`) ?? "").trim(), email: String(data.get(`${item.itemId}-email`) ?? "").trim(), maxWaitHours: (waitingPeriods[item.itemId] ?? 0) * 24, backup };
    });
    if (recipients.some((person) => !person.name || !person.email || person.maxWaitHours === 0 || (person.backup && (!person.backup.name || !person.backup.email)))) {
      setErrorMessage("담당자 정보와 대기 기간을 모두 입력해 주세요."); return;
    }
    setPending(true); setErrorMessage("");
    try { await registerRecipients(planId, recipients); router.push("/order"); }
    catch (error) { setErrorMessage(getApiErrorMessage(error, "역할 담당자를 등록하지 못했습니다.")); setPending(false); }
  };

  return <PageContainer className="gap-[22px] py-[70px]">
    <PageHeader title="역할 담당자 등록" backHref="/life-area" backLabel="계획 작성으로 돌아가기" className="pb-5" />
    {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
    <form className="flex w-full flex-col gap-[30px]" onSubmit={handleSubmit}>
      {items.map((item) => <fieldset className="flex flex-col gap-[18px] rounded-[20px] border border-[#d9d9d9] p-5" key={item.itemId}>
        <legend className="px-2 font-bold">{item.title}</legend>
        <FormField id={`${item.itemId}-name`} name={`${item.itemId}-name`} label="담당자 이름" placeholder="이름을 입력해 주세요" type="text" autoComplete="name" />
        <FormField id={`${item.itemId}-email`} name={`${item.itemId}-email`} label="담당자 이메일" placeholder="이메일을 입력해 주세요" type="email" autoComplete="email" />
        <div className="flex w-full flex-col gap-2.5">
          <span className="px-2.5 text-sm font-semibold">대기 기간</span>
          <div className="grid grid-cols-3 gap-2.5">
            {[7, 14, 21].map((days) => {
              const selected = waitingPeriods[item.itemId] === days;
              return <button
                aria-pressed={selected}
                className={`h-[45px] rounded-[20px] text-sm transition-colors ${selected ? "bg-[#838383] font-semibold text-white" : "bg-white text-[#a8a8a8] hover:bg-[#e4e4e6]"}`}
                key={days}
                onClick={() => toggleWaitingPeriod(item.itemId, days)}
                type="button"
              >{days}일</button>;
            })}
          </div>
        </div>
        <OutlineButton onClick={() => toggleBackup(item.itemId)} type="button">{backups.has(item.itemId) ? "대체 담당자 제거" : "대체 담당자 등록"}</OutlineButton>
        {backups.has(item.itemId) && <div className="flex flex-col gap-4"><FormField id={`${item.itemId}-backup-name`} name={`${item.itemId}-backup-name`} label="대체 담당자 이름" placeholder="이름을 입력해 주세요" type="text" autoComplete="name" /><FormField id={`${item.itemId}-backup-email`} name={`${item.itemId}-backup-email`} label="대체 담당자 이메일" placeholder="이메일을 입력해 주세요" type="email" autoComplete="email" /></div>}
      </fieldset>)}
      {items.length === 0 && <p className="text-sm text-[#838383]">담당자를 연결할 계획 항목이 없습니다.</p>}
      <Button disabled={pending || items.length === 0} type="submit">{pending ? "등록 중..." : "등록하기"}</Button>
    </form>
  </PageContainer>;
}

// 계획 항목별 역할 담당자와 선택적인 대체 담당자를 일괄 등록하는 화면입니다.

"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { OutlineButton } from "@/components/OutlineButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import {
  getHandoffChecks,
  getLifeAreas,
  getMyPlan,
  getRecipientDetail,
  getRoleChecks,
  registerRecipients,
} from "@/lib/api/plan";
import type { PlanItem, RecipientDetailResponse } from "@/lib/api/plan-types";

type ExistingAssignment = RecipientDetailResponse & { backupName: string | null };

const roleTitles = ["가족 담당자", "관계 정리 담당자", "업무 처리 담당자"];
const numberIcons = ["one", "two", "three"];

export default function ManagerPage() {
  const router = useRouter();
  const [planId, setPlanId] = useState<number | null>(null);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [backups, setBackups] = useState<Set<number>>(new Set());
  const [waitingPeriods, setWaitingPeriods] = useState<Record<number, number | null>>({});
  const [existingAssignments, setExistingAssignments] = useState<Record<number, ExistingAssignment>>({});
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 전체 계획과 기존 담당자 상세·대체 담당자 이름을 조회해 계획별 폼에 병합합니다.
    getMyPlan().then(async (plan) => {
      setPlanId(plan.planId);
      const [areas, roleChecks, handoffChecks] = await Promise.all([
        getLifeAreas(plan.planId),
        getRoleChecks(plan.planId),
        getHandoffChecks(plan.planId),
      ]);
      const details = await Promise.all(roleChecks
        .filter((role) => role.type === "RECIPIENT")
        .map((role) => getRecipientDetail(plan.planId, role.id)));
      const backupNames = new Map(handoffChecks.assignees.map((assignee) => [assignee.assigneeId, assignee.backupName]));
      const assignments: Record<number, ExistingAssignment> = {};
      const periods: Record<number, number | null> = {};
      const backupItemIds = new Set<number>();
      details.forEach((detail) => detail.items.forEach((item) => {
        const backupName = backupNames.get(detail.assigneeId) ?? null;
        assignments[item.itemId] = { ...detail, backupName };
        periods[item.itemId] = detail.maxWaitHours / 24;
        if (backupName) backupItemIds.add(item.itemId);
      }));
      setItems(areas.flatMap((area) => area.items));
      setExistingAssignments(assignments);
      setWaitingPeriods(periods);
      setBackups(backupItemIds);
    }).catch((error) => setErrorMessage(getApiErrorMessage(error, "계획 항목을 불러오지 못했습니다.")));
  }, []);

  const toggleBackup = (itemId: number) => setBackups((current) => {
    const next = new Set(current);
    if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
    return next;
  });

  const changeWaitingPeriod = (itemId: number, value: string) => {
    const days = value === "" ? null : Number(value);
    setWaitingPeriods((current) => ({
      ...current,
      [itemId]: days,
    }));
  };

  // 각 계획의 itemId와 담당자 입력값을 묶어 recipients 배열로 일괄 전송합니다.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || planId == null) return;
    const data = new FormData(event.currentTarget);
    const recipients = items.filter((item) => !existingAssignments[item.itemId]).map((item) => {
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

  return <PageContainer className="gap-3 pb-10 pt-[70px] md:!px-[120px] md:!pt-0">
    <PageHeader title="역할 담당자 등록" backHref="/life-area" backLabel="계획 작성으로 돌아가기" className="items-center px-1 py-2 md:px-0 md:py-0" />
    <form className="mx-auto flex w-full max-w-[342px] flex-col gap-5 pt-3 md:max-w-[460px] md:pt-[38px]" onSubmit={handleSubmit}>
      {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
      {items.map((item, index) => {
        const existing = existingAssignments[item.itemId];
        return <fieldset className="flex w-full flex-col gap-2" key={item.itemId}>
          <legend className="sr-only">{roleTitles[index] ?? item.title}</legend>
          <div className="flex w-full flex-col items-start gap-2 rounded-[16px] bg-[#f3f3ff] px-5 pb-[22px] pt-[18px]">
            {index < 3 ? <Image alt={`${index + 1}번 역할`} height={24} src={`/icons/manager-number-${numberIcons[index]}.svg`} width={24} /> : <span className="flex size-6 items-center justify-center rounded-full border border-[#7f62b8] text-xs text-[#7f62b8]">{index + 1}</span>}
            <strong className="text-sm text-[#43306d] md:text-base">{roleTitles[index] ?? item.title}</strong>
          </div>
          <div className="flex w-full flex-col gap-3 pb-3">
            <FormField id={`${item.itemId}-name`} name={`${item.itemId}-name`} label="담당자 이름" placeholder="이름을 입력해 주세요" type="text" autoComplete="name" defaultValue={existing?.name ?? ""} readOnly={Boolean(existing)} />
            <FormField id={`${item.itemId}-email`} name={`${item.itemId}-email`} label="담당자 이메일" placeholder="이메일을 입력해 주세요" type="email" autoComplete="email" defaultValue={existing?.email ?? ""} readOnly={Boolean(existing)} />
            <FormField id={`${item.itemId}-waiting-period`} label="대기 기간" placeholder="대기 기간을 입력해 주세요 (7-30일)" type="number" inputMode="numeric" min={7} max={30} value={waitingPeriods[item.itemId] ?? ""} onChange={(event) => changeWaitingPeriod(item.itemId, event.target.value)} readOnly={Boolean(existing)} />
          </div>
          <OutlineButton className="rounded-[14px] border-[1.4px] border-[#7f62b8] text-[#7f62b8] md:text-base" disabled={Boolean(existing)} onClick={() => toggleBackup(item.itemId)} type="button">
            <Image alt="" height={20} src="/icons/manager-user-plus.svg" width={20} />
            {backups.has(item.itemId) ? "대체 담당자 제거하기" : "대체 담당자 등록하기"}
          </OutlineButton>
          {backups.has(item.itemId) && <div className="flex flex-col gap-3 pt-1"><FormField id={`${item.itemId}-backup-name`} name={`${item.itemId}-backup-name`} label="대체 담당자 이름" placeholder="이름을 입력해 주세요" type="text" autoComplete="name" defaultValue={existing?.backupName ?? ""} readOnly={Boolean(existing)} /><FormField id={`${item.itemId}-backup-email`} name={`${item.itemId}-backup-email`} label="대체 담당자 이메일" placeholder="이메일을 입력해 주세요" type="email" autoComplete="email" readOnly={Boolean(existing)} /></div>}
        </fieldset>;
      })}
      {items.length === 0 && <p className="text-sm text-[#838383]">담당자를 연결할 계획 항목이 없습니다.</p>}
      <div className="pt-[22px]">
        <Button disabled={pending || items.length === 0 || items.every((item) => existingAssignments[item.itemId])} type="submit">{pending ? "등록 중..." : "등록하기"}</Button>
      </div>
    </form>
  </PageContainer>;
}

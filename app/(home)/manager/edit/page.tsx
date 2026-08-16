// 계획별 역할 담당자의 기존 이름과 이메일을 조회하고 수정하는 화면입니다.

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import {
  getMyPlan,
  getRecipientDetail,
  getRoleChecks,
  updateRecipient,
} from "@/lib/api/plan";
import type { PlanItem } from "@/lib/api/plan-types";

type RecipientAssignment = {
  assigneeId: number;
  name: string;
  email: string;
  item: PlanItem;
};

export default function ManagerEditPage() {
  const router = useRouter();
  const [planId, setPlanId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<RecipientAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    // 역할 목록의 담당자 ID로 상세 정보를 병렬 조회해 계획별 폼 데이터를 구성합니다.
    getMyPlan().then(async (plan) => {
      const roleChecks = await getRoleChecks(plan.planId);
      const recipientChecks = roleChecks.filter((role) => role.type === "RECIPIENT");
      const details = await Promise.all(
        recipientChecks.map((role) => getRecipientDetail(plan.planId, role.id)),
      );
      if (!active) return;
      setPlanId(plan.planId);
      setAssignments(details.flatMap((detail) => detail.items.map((item) => ({
        assigneeId: detail.assigneeId,
        name: detail.name,
        email: detail.email,
        item,
      }))).sort((a, b) => a.item.sortOrder - b.item.sortOrder));
    }).catch((error) => {
      if (active) setErrorMessage(getApiErrorMessage(error, "역할 담당자 정보를 불러오지 못했습니다."));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  // 계획별 입력값을 담당자 ID 기준으로 묶어 이름과 이메일 수정 API를 호출합니다.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || planId == null) return;
    const data = new FormData(event.currentTarget);
    const updates = new Map<number, { name: string; email: string }>();

    assignments.forEach((assignment) => {
      const fieldKey = `${assignment.assigneeId}-${assignment.item.itemId}`;
      updates.set(assignment.assigneeId, {
        name: String(data.get(`${fieldKey}-name`) ?? "").trim(),
        email: String(data.get(`${fieldKey}-email`) ?? "").trim(),
      });
    });

    if ([...updates.values()].some((recipient) => !recipient.name || !recipient.email)) {
      setErrorMessage("모든 역할 담당자의 이름과 이메일을 입력해 주세요.");
      return;
    }

    setPending(true);
    setErrorMessage("");
    try {
      await Promise.all([...updates].map(([assigneeId, request]) =>
        updateRecipient(planId, assigneeId, request),
      ));
      router.push("/plan");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "역할 담당자를 수정하지 못했습니다."));
      setPending(false);
    }
  };

  return <PageContainer className="gap-[22px] py-[70px]">
    <PageHeader title="역할 담당자 수정" backHref="/plan" backLabel="계획 홈으로 돌아가기" className="pb-5" />
    {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
    {loading && <p className="text-sm text-[#838383]">역할 담당자 정보를 불러오고 있습니다.</p>}
    <form className="flex w-full flex-col gap-[30px]" onSubmit={handleSubmit}>
      {assignments.map((assignment) => {
        const fieldKey = `${assignment.assigneeId}-${assignment.item.itemId}`;
        return <fieldset className="flex flex-col gap-[18px] rounded-[20px] border border-[#d9d9d9] p-5" key={fieldKey}>
          <legend className="px-2 font-bold">{assignment.item.title}</legend>
          <FormField id={`${fieldKey}-name`} name={`${fieldKey}-name`} label="담당자 이름" placeholder="이름을 입력해 주세요" type="text" autoComplete="name" defaultValue={assignment.name} />
          <FormField id={`${fieldKey}-email`} name={`${fieldKey}-email`} label="담당자 이메일" placeholder="이메일을 입력해 주세요" type="email" autoComplete="email" defaultValue={assignment.email} />
        </fieldset>;
      })}
      {!loading && assignments.length === 0 && <p className="text-sm text-[#838383]">수정할 역할 담당자가 없습니다.</p>}
      <Button disabled={pending || loading || assignments.length === 0} type="submit">{pending ? "수정 중..." : "수정하기"}</Button>
    </form>
  </PageContainer>;
}

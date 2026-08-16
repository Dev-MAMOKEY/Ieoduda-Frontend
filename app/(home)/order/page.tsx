// 계획 카드 순서를 변경할 때 서버 충돌 점검 결과를 즉시 반영하고 순서를 확정하는 화면입니다.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import { confirmPlanOrder, getMyPlan, getOrderCheck, reorderPlanItems } from "@/lib/api/plan";
import type { OrderCheckItem } from "@/lib/api/plan-types";

// 실행 순서 카드 하단의 담당자·대기 기간·승인 상태를 기존 디자인으로 표시합니다.
function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[20px] bg-[#f0f0f2] px-5 py-[18px] text-xs">
    <strong>{label}</strong>
    <span className="truncate font-medium text-[#838383]">{value}</span>
  </div>;
}

export default function OrderPage() {
  const router = useRouter();
  const [planId, setPlanId] = useState<number | null>(null);
  const [items, setItems] = useState<OrderCheckItem[]>([]);
  const [hasConflict, setHasConflict] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 서버가 저장한 최신 실행 순서와 기존 충돌 상태를 함께 불러옵니다.
    getMyPlan().then(async (plan) => {
      const order = await getOrderCheck(plan.planId);
      setPlanId(plan.planId); setItems(order.items); setHasConflict(order.hasConflict);
    }).catch((error) => setErrorMessage(getApiErrorMessage(error, "실행 순서를 불러오지 못했습니다.")));
  }, []);

  // 드래그 결과를 서버에 저장하고 서버가 다시 판정한 충돌 정보로 화면을 교체합니다.
  const moveAndCheck = async (targetId: number) => {
    if (draggedId == null || draggedId === targetId || planId == null) return;
    const next = [...items];
    const from = next.findIndex((item) => item.itemId === draggedId);
    const to = next.findIndex((item) => item.itemId === targetId);
    const [moved] = next.splice(from, 1); next.splice(to, 0, moved);
    setItems(next);
    try {
      const checked = await reorderPlanItems(planId, next.map((item) => item.itemId));
      setItems(checked.items); setHasConflict(checked.hasConflict);
    } catch (error) { setErrorMessage(getApiErrorMessage(error, "순서를 변경하지 못했습니다.")); }
  };

  const handleConfirm = async () => {
    if (planId == null || hasConflict || pending) return;
    setPending(true);
    try { await confirmPlanOrder(planId); router.push("/plan"); }
    catch (error) { setErrorMessage(getApiErrorMessage(error, "순서를 확정하지 못했습니다.")); setPending(false); }
  };

  return <PageContainer className="gap-[22px] py-[70px]">
    <PageHeader title="실행 순서 점검" backHref="/plan" backLabel="계획 홈으로 돌아가기" className="pb-5" />
    {hasConflict && <section className="rounded-[20px] bg-[#d9d9d9] px-5 py-[18px]" role="alert"><h2 className="font-bold">순서 충돌이 있습니다.</h2><ul className="mt-2 text-sm text-[#838383]">{items.filter((item) => item.conflict).map((item) => <li key={item.itemId}>{item.conflictMessage ?? `${item.title}의 순서를 확인해 주세요.`}</li>)}</ul></section>}
    {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
    <p className="text-sm text-[#838383]">카드를 드래그해 순서를 변경하면 서버에서 충돌 여부를 다시 확인합니다.</p>
    <div className="flex w-full flex-col gap-[22px]">{items.map((item, index) => {
      const dragging = draggedId === item.itemId;
      return <article
        aria-label={`${index + 1}번 ${item.title}. 드래그하여 순서 변경`}
        className={`flex w-full touch-none cursor-grab select-none flex-col gap-2 rounded-[20px] border-[1.4px] bg-white px-5 py-[18px] outline-none transition-[transform,opacity,box-shadow,border-color] duration-200 active:cursor-grabbing ${selectedId === item.itemId ? "border-[#838383] shadow-[0_0_0_2px_rgba(131,131,131,0.12)]" : "border-transparent"} ${dragging ? "scale-[0.98] opacity-60 shadow-lg" : "scale-100 opacity-100"}`}
        data-order-id={item.itemId}
        key={item.itemId}
        onClick={() => setSelectedId(item.itemId)}
        onFocus={() => setSelectedId(item.itemId)}
        onPointerCancel={() => setDraggedId(null)}
        onPointerDown={(event) => {
          setDraggedId(item.itemId);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (draggedId == null) return;
          const target = document.elementsFromPoint(event.clientX, event.clientY).find(
            (element) => element instanceof HTMLElement && element.dataset.orderId,
          );
          if (target instanceof HTMLElement) void moveAndCheck(Number(target.dataset.orderId));
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          setDraggedId(null);
        }}
        style={{ viewTransitionName: `order-${item.itemId}` }}
        tabIndex={0}
      >
        <div className="flex items-center justify-between">
          <strong className="text-[17px]">{index + 1}</strong>
          <span className="text-xs font-medium text-[#838383]">{item.actionType}</span>
        </div>
        <h3 className="text-sm font-bold">{item.title}</h3>
        <div className="flex gap-2.5">
          <Detail label="담당자" value={item.recipientName ?? "미등록"} />
          <Detail label="대기 기간" value={item.maxWaitHours == null ? "미설정" : `${item.maxWaitHours / 24}일`} />
          <Detail label="승인 여부" value={item.acceptanceStatus ?? "미승인"} />
        </div>
      </article>;
    })}</div>
    <Button disabled={hasConflict || pending || items.length === 0} onClick={handleConfirm} type="button">{pending ? "확정 중..." : "순서 확정하기"}</Button>
  </PageContainer>;
}

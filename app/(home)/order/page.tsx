// 계획 카드 순서를 변경할 때 서버 충돌 점검 결과를 즉시 반영하고 순서를 확정하는 화면입니다.

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import { confirmPlanOrder, getMyPlan, getOrderCheck, reorderPlanItems } from "@/lib/api/plan";
import type { ApiId, OrderCheckItem } from "@/lib/api/plan-types";
import { showSnackbarAfterNavigation } from "@/lib/ui/snackbar";

// 실행 순서 카드 하단의 담당자·대기 기간·승인 상태를 기존 디자인으로 표시합니다.
function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[20px] bg-[#eeecee] px-4 py-[18px] md:px-5">
    <strong className="text-xs font-semibold text-[#43306d] md:text-sm">{label}</strong>
    <span className="truncate text-[13px] font-medium text-[#584e4d] md:text-[15px]">{value}</span>
  </div>;
}

function getActionLabel(actionType: OrderCheckItem["actionType"]) {
  if (actionType === "DELETE") return "삭제";
  if (actionType === "TRANSFER") return "인계";
  return "기타";
}

function getAcceptanceLabel(status: OrderCheckItem["acceptanceStatus"]) {
  if (status === "ACCEPTED") return "수락 완료";
  if (status === "PENDING") return "수락 대기";
  if (status === "DECLINED") return "수락 거절";
  if (status === "EXPIRED") return "수락 만료";
  return "미승인";
}

export default function OrderPage() {
  const router = useRouter();
  const [planId, setPlanId] = useState<ApiId | null>(null);
  const [items, setItems] = useState<OrderCheckItem[]>([]);
  const [hasConflict, setHasConflict] = useState(false);
  const [draggedId, setDraggedId] = useState<ApiId | null>(null);
  const [selectedId, setSelectedId] = useState<ApiId | null>(null);
  const [pending, setPending] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const itemsRef = useRef<OrderCheckItem[]>([]);
  const dragStartItemsRef = useRef<OrderCheckItem[]>([]);
  const dragChangedRef = useRef(false);

  useEffect(() => {
    // 서버가 저장한 최신 실행 순서와 기존 충돌 상태를 함께 불러옵니다.
    getMyPlan().then(async (plan) => {
      const order = await getOrderCheck(plan.planId);
      setPlanId(plan.planId);
      setItems(order.items);
      itemsRef.current = order.items;
      setHasConflict(order.items.some((item) => item.conflict));
    }).catch((error) => setErrorMessage(getApiErrorMessage(error, "실행 순서를 불러오지 못했습니다.")));
  }, []);

  // 드래그 중에는 화면 순서만 변경하고 서버 요청은 보내지 않습니다.
  const moveItem = (targetId: string) => {
    if (draggedId == null || String(draggedId) === targetId) return;
    const next = [...itemsRef.current];
    const from = next.findIndex((item) => String(item.itemId) === String(draggedId));
    const to = next.findIndex((item) => String(item.itemId) === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    dragChangedRef.current = true;
    itemsRef.current = next;
    setItems(next);
  };

  // 드래그 종료 시 최종 순서를 한 번 저장하고 서버의 충돌 판정 결과를 반영합니다.
  const saveOrder = async () => {
    if (planId == null || reordering || !dragChangedRef.current) return;
    dragChangedRef.current = false;
    setReordering(true);
    setErrorMessage("");
    try {
      const saved = await reorderPlanItems(planId, itemsRef.current.map((item) => item.itemId));
      let latest = saved;
      try {
        // 순서 저장 직후 최신 조회 결과로 다시 동기화해 충돌과 경고 상태가 섞이지 않도록 합니다.
        latest = await getOrderCheck(planId);
      } catch {
        setErrorMessage("순서는 저장됐지만 최신 점검 결과를 다시 불러오지 못했습니다.");
      }
      setItems(latest.items);
      itemsRef.current = latest.items;
      setHasConflict(latest.items.some((item) => item.conflict));
    } catch (error) {
      setItems(dragStartItemsRef.current);
      itemsRef.current = dragStartItemsRef.current;
      setErrorMessage(getApiErrorMessage(error, "순서를 변경하지 못했습니다."));
    } finally {
      setReordering(false);
    }
  };

  const handleConfirm = async () => {
    if (planId == null || hasConflict || pending) return;
    setPending(true);
    try { await confirmPlanOrder(planId); showSnackbarAfterNavigation("실행 순서가 확정되었습니다."); router.push("/plan"); }
    catch (error) { setErrorMessage(getApiErrorMessage(error, "순서를 확정하지 못했습니다.")); setPending(false); }
  };

  const conflictingItems = items.filter((item) => item.conflict);
  const latestConflictItem = [...conflictingItems]
    .reverse()
    .find((item) => item.conflictMessage?.trim()) ?? conflictingItems[conflictingItems.length - 1];
  const latestConflictMessage = latestConflictItem?.conflictMessage
    ?? (latestConflictItem ? `${latestConflictItem.title}의 순서를 확인해 주세요.` : "실행 순서를 확인해 주세요.");
  const warningItems = items.filter((item) => item.warning);
  const warningMessages = [...new Set(warningItems
    .map((item) => item.warningMessage?.trim())
    .filter((message): message is string => Boolean(message)))];

  return <PageContainer className="gap-3 pb-10 pt-[70px] md:!px-[120px] md:!pt-0">
    <PageHeader title="실행 순서 점검" backHref="/plan" backLabel="계획 홈으로 돌아가기" className="mx-auto max-w-[342px] items-center px-1 py-2 md:max-w-[460px] md:px-0 md:py-0" />
    <div className="mx-auto flex w-full max-w-[342px] flex-col gap-10 pt-3 md:max-w-[460px] md:pt-[38px]">
      {hasConflict && <section className="rounded-[20px] bg-[#f3f3ff] px-5 pb-[22px] pt-5" role="alert">
        <Image alt="" className="size-6" height={24} src="/icons/order-warning.svg" width={24} />
        <h2 className="mt-2.5 text-sm font-bold text-[#43306d] md:text-base">순서 충돌 {conflictingItems.length}건</h2>
        <p className="mt-2.5 whitespace-pre-wrap text-xs font-normal leading-normal text-[#796b6c] md:text-sm">{latestConflictMessage}</p>
      </section>}
      {warningItems.length > 0 && <section className="rounded-[20px] bg-[#f3f3ff] px-5 pb-[22px] pt-5" role="status">
        <Image alt="" className="size-6" height={24} src="/icons/order-warning.svg" width={24} />
        <h2 className="mt-2.5 text-sm font-bold text-[#43306d] md:text-base">대체 담당자를 확인해 주세요</h2>
        <div className="mt-2.5 flex flex-col gap-1.5 text-xs font-normal leading-normal text-[#796b6c] md:text-sm">
          {warningMessages.length > 0
            ? warningMessages.map((message) => <p className="whitespace-pre-wrap" key={message}>{message}</p>)
            : <p>대체 담당자가 등록되지 않은 항목이 {warningItems.length}개 있어요.</p>}
        </div>
      </section>}
      {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}

      <section className="flex w-full flex-col gap-[22px]">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-base font-bold text-[#28292e] md:text-lg">실행 순서</h2>
          <p className="text-[13px] font-medium text-[#584e4d] md:text-[15px]">드래그로 순서 변경이 가능해요</p>
        </div>
        <div className="flex w-full flex-col gap-[22px]">{items.map((item, index) => {
      const dragging = draggedId === item.itemId;
      return <article
        aria-label={`${index + 1}번 ${item.title}. 드래그하여 순서 변경`}
        className={`flex w-full touch-none cursor-grab select-none flex-col gap-2 rounded-[20px] border-[1.4px] bg-white px-5 py-[18px] outline-none transition-[transform,opacity,box-shadow,border-color] duration-200 active:cursor-grabbing md:px-[26px] ${selectedId === item.itemId ? "border-[#7f62b8] shadow-[0_0_0_2px_rgba(127,98,184,0.12)]" : "border-[#a8a8a8]"} ${dragging ? "scale-[0.98] opacity-60 shadow-lg" : "scale-100 opacity-100"}`}
        data-order-id={item.itemId}
        key={item.itemId}
        onClick={() => setSelectedId(item.itemId)}
        onFocus={() => setSelectedId(item.itemId)}
        onPointerCancel={() => {
          setDraggedId(null);
          dragChangedRef.current = false;
          setItems(dragStartItemsRef.current);
          itemsRef.current = dragStartItemsRef.current;
        }}
        onPointerDown={(event) => {
          if (reordering) return;
          dragStartItemsRef.current = itemsRef.current;
          dragChangedRef.current = false;
          setDraggedId(item.itemId);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (draggedId == null) return;
          const target = document.elementsFromPoint(event.clientX, event.clientY).find(
            (element) => element instanceof HTMLElement && element.dataset.orderId,
          );
          if (target instanceof HTMLElement && target.dataset.orderId) moveItem(target.dataset.orderId);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          setDraggedId(null);
          void saveOrder();
        }}
        style={{ viewTransitionName: `order-${item.itemId}` }}
        tabIndex={0}
      >
        <div className="flex items-center justify-between">
          <strong className="text-base font-bold text-[#43306d] md:text-lg">{index + 1}</strong>
          <span className="text-xs font-medium text-[#838383] md:text-sm">{item.conflict ? `${getActionLabel(item.actionType)}·충돌` : "가능"}</span>
        </div>
        <h3 className="text-sm font-bold text-[#43306d] md:text-base">{item.title}</h3>
        <div className="flex gap-2.5">
          <Detail label="담당자" value={item.recipientName ?? "미등록"} />
          <Detail label="대기 기간" value={item.maxWaitHours == null ? "미설정" : `${item.maxWaitHours / 24}일`} />
          <Detail label="승인 여부" value={getAcceptanceLabel(item.acceptanceStatus)} />
        </div>
      </article>;
        })}</div>
      </section>

      <div className="flex w-full flex-col gap-[26px]">
        {hasConflict && <p className="text-center text-xs font-normal text-[#796b6c] md:text-sm">충돌 {conflictingItems.length}건을 해결해야 확정 할 수 있어요</p>}
        <Button className="disabled:bg-[#f3f3ff] disabled:text-[#a99d9e] disabled:opacity-100" disabled={hasConflict || pending || reordering || items.length === 0} onClick={handleConfirm} type="button">{pending ? "확정 중..." : "확정하기"}</Button>
      </div>
    </div>
  </PageContainer>;
}

"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getExecutionOrder } from "@/lib/api";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[20px] bg-[#f0f0f2] px-5 py-[18px] text-xs">
      <strong>{label}</strong>
      <span className="truncate font-medium text-[#838383]">{value}</span>
    </div>
  );
}

export default function OrderPage() {
  const order = getExecutionOrder();
  const [items, setItems] = useState(order.items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const moveItem = (targetId: string | undefined) => {
    if (!draggedId || draggedId === targetId) return;

    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === draggedId);
      const toIndex = current.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return current;

      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <PageContainer className="gap-[22px] py-[70px]" data-node-id="439:1595">
      <PageHeader
        title="실행 순서 점검"
        backHref="/plan"
        backLabel="계획 홈 화면으로 돌아가기"
        className="pb-5"
      />

      <section className="flex w-full flex-col gap-2.5 rounded-[20px] bg-[#d9d9d9] px-5 pb-[22px] pt-[18px]">
        <span aria-hidden className="text-xl text-[#838383]">
          ⚠
        </span>
        <h2 className="text-[13px] font-bold">
          순서 충돌 {order.conflictCount}건
        </h2>
        <div className="flex flex-col gap-1.5 text-xs font-medium leading-[18px] text-[#838383]">
          <p>클라우드를 먼저 정리하면 가족 사진 및 파일을 인계 할 수 없어요.</p>
          <p>클라우드 정리를 나중으로 실행하는걸 추천해요.</p>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-bold">실행 순서</h2>
        <p className="text-[13px] font-medium text-[#838383]">
          카드를 드래그해 순서를 변경할 수 있어요
        </p>
      </section>

      <div className="flex w-full flex-col gap-[22px]">
        {items.map((item, index) => {
          const dragging = draggedId === item.id;
          return (
            <article
              aria-label={`${index + 1}번 ${item.title}. 드래그하여 순서 변경`}
              className={`flex w-full touch-none cursor-grab select-none flex-col gap-2 rounded-[20px] border-[1.4px] bg-white px-5 py-[18px] outline-none transition-[transform,opacity,box-shadow,border-color] duration-200 active:cursor-grabbing ${selectedId === item.id ? "border-[#838383] shadow-[0_0_0_2px_rgba(131,131,131,0.12)]" : "border-transparent"} ${dragging ? "scale-[0.98] opacity-60 shadow-lg" : "scale-100 opacity-100"}`}
              data-order-id={item.id}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              onFocus={() => setSelectedId(item.id)}
              onPointerCancel={() => setDraggedId(null)}
              onPointerDown={(event) => {
                setDraggedId(item.id);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!draggedId) return;
                const target = document
                  .elementsFromPoint(event.clientX, event.clientY)
                  .find(
                    (element) =>
                      element instanceof HTMLElement && element.dataset.orderId,
                  );
                if (target instanceof HTMLElement)
                  moveItem(target.dataset.orderId);
              }}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                setDraggedId(null);
              }}
              style={{ viewTransitionName: `order-${item.id}` }}
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <strong className="text-[17px]">{index + 1}</strong>
                <span className="text-xs font-medium text-[#838383]">
                  {item.state}
                </span>
              </div>
              <h3 className="text-sm font-bold">{item.title}</h3>
              <div className="flex gap-2.5">
                <Detail label="담당자" value={item.manager} />
                <Detail label="대기 기간" value={item.waitingPeriod} />
                <Detail label="승인 여부" value={item.approval} />
              </div>
            </article>
          );
        })}
      </div>

      <p className="w-full py-2.5 text-center text-[13px] font-medium text-[#838383]">
        충돌 {order.conflictCount}건을 해결해야 확정 할 수 있어요
      </p>
      <Button disabled type="button">
        순서 확정하기
      </Button>
    </PageContainer>
  );
}

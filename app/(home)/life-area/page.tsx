// AI 대화와 계획 카드를 표시하고 카드 승인·수정·삭제를 서버와 동기화하는 화면입니다.

"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import {
  clearStoredConversationId,
  getStoredConversationId,
  setStoredConversationId,
} from "@/lib/api/conversation-storage";
import {
  approvePlanItem,
  deletePlanItem,
  getConversationMessages,
  getLifeAreas,
  getMyPlan,
  sendConversationMessage,
  startConversation,
  updatePlanItem,
} from "@/lib/api/plan";
import type {
  ConversationMessage,
  MessageHistoryResponse,
  PlanItem,
  PlanItemUpdateRequest,
} from "@/lib/api/plan-types";

type PlanItemCardProps = {
  item: PlanItem;
  displayOrder: number;
  busy: boolean;
  onApprove: () => void;
  onDelete: () => void;
  onSave: (request: PlanItemUpdateRequest) => Promise<boolean>;
};

type AssistantPayload = {
  type?: string;
  question?: string;
  notice?: string;
  items?: Array<Partial<PlanItem>>;
};

// AI JSON 문자열을 질문과 계획 결과를 구분할 수 있는 객체로 안전하게 변환합니다.
function getAssistantPayload(message: ConversationMessage) {
  if (message.role !== "ASSISTANT") return null;
  try {
    return JSON.parse(message.content) as AssistantPayload;
  } catch {
    // 일반 텍스트 AI 발화에는 별도의 JSON 처리를 적용하지 않습니다.
    return null;
  }
}

// 백엔드가 AI 발화를 JSON 문자열로 저장한 경우 사람이 읽는 말풍선 문장으로 바꿉니다.
function getMessageContent(message: ConversationMessage) {
  const payload = getAssistantPayload(message);
  if (payload?.type === "QUESTION" && payload.question) return payload.question;
  if (payload?.type === "RESULT") return payload.notice ?? "요청하신 내용을 계획에 반영했어요.";

  return message.content;
}

// 계획 카드의 조회 상태와 인라인 편집 상태를 한 컴포넌트에서 전환합니다.
function PlanItemCard({ item, displayOrder, busy, onApprove, onDelete, onSave }: PlanItemCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PlanItemUpdateRequest>({
    targetName: item.targetName ?? "",
    locationType: item.locationType ?? "",
    action: item.action ?? "",
    title: item.title,
    content: item.content,
    precondition: item.precondition ?? "",
    disclosureScope: item.disclosureScope ?? "FAMILY",
    actionType: item.actionType,
  });

  // 입력 필드 하나만 바꾸면서 나머지 수정값을 유지합니다.
  const change = (field: keyof PlanItemUpdateRequest, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  // 서버 저장이 성공한 경우에만 편집 상태를 닫습니다.
  const save = async () => {
    if (await onSave(draft)) setEditing(false);
  };

  const canSave = draft.targetName.trim() && draft.locationType.trim() && draft.action.trim()
    && draft.title.trim() && draft.content.trim() && draft.disclosureScope;

  return (
    <article className="flex h-full flex-col gap-4 rounded-[30px] bg-[#d5d5d5] px-[22px] py-5">
      <div className="flex items-center justify-between text-xs text-[#838383]">
        <span>계획 {displayOrder}</span>
        <span>{item.status === "APPROVED" ? "승인 완료" : "승인 대기"}</span>
      </div>

      {editing ? (
        <div className="flex flex-col gap-3">
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="계획 제목" value={draft.title} onChange={(event) => change("title", event.target.value)} />
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="계획 대상" placeholder="대상 이름" value={draft.targetName} onChange={(event) => change("targetName", event.target.value)} />
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="자료 위치 유형" placeholder="자료 위치 유형" value={draft.locationType} onChange={(event) => change("locationType", event.target.value)} />
          <textarea className="min-h-20 rounded-xl bg-white px-3 py-2 text-sm" aria-label="계획 내용" value={draft.content} onChange={(event) => change("content", event.target.value)} />
          <textarea className="min-h-16 rounded-xl bg-white px-3 py-2 text-sm" aria-label="수행 행동" value={draft.action} onChange={(event) => change("action", event.target.value)} />
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="선행 조건" placeholder="선행 조건(선택)" value={draft.precondition} onChange={(event) => change("precondition", event.target.value)} />
          <select className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="공개 범위" value={draft.disclosureScope} onChange={(event) => change("disclosureScope", event.target.value)}>
            <option value="FAMILY">가족</option><option value="WORK">업무</option><option value="RELATIONSHIP">관계</option>
          </select>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2">
          {item.sourceExcerpt && <><span className="text-xs font-semibold text-[#838383]">원문 근거</span><p className="line-clamp-2 text-sm">{item.sourceExcerpt}</p></>}
          <h2 className="font-bold">{item.title}</h2>
          <p className="text-sm text-[#838383]">{item.content || item.action}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {editing ? <>
          <button className="col-span-2 h-10 rounded-[20px] bg-[#838383] text-sm text-white disabled:opacity-50" disabled={busy || !canSave} onClick={save} type="button">저장</button>
          <button className="h-10 rounded-[20px] bg-white text-sm" disabled={busy} onClick={() => setEditing(false)} type="button">취소</button>
        </> : <>
          <button className="h-10 rounded-[20px] bg-[#838383] text-sm text-white disabled:opacity-50" disabled={busy || item.status === "APPROVED"} onClick={onApprove} type="button">{item.status === "APPROVED" ? "승인됨" : "승인"}</button>
          <button className="h-10 rounded-[20px] bg-[#a8a8a8] text-sm text-white" disabled={busy} onClick={() => setEditing(true)} type="button">수정</button>
          <button className="h-10 rounded-[20px] bg-[#a8a8a8] text-sm text-white" disabled={busy} onClick={onDelete} type="button">삭제</button>
        </>}
      </div>
    </article>
  );
}

export default function LifeAreaPage() {
  const [planId, setPlanId] = useState<number | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    // 저장된 conversationId가 있으면 백엔드 이력을 복구하고, 없거나 무효할 때만 새 세션을 만듭니다.
    getMyPlan().then(async (plan) => {
      const areas = await getLifeAreas(plan.planId);
      let nextConversationId = getStoredConversationId(plan.planId);
      let history: MessageHistoryResponse | undefined;

      if (nextConversationId != null) {
        try {
          history = await getConversationMessages(plan.planId, nextConversationId);
        } catch {
          // 서버에서 더 이상 찾을 수 없는 로컬 세션 ID는 제거한 뒤 새 세션으로 대체합니다.
          clearStoredConversationId(plan.planId);
          nextConversationId = null;
        }
      }

      if (nextConversationId == null) {
        const conversation = await startConversation(plan.planId);
        nextConversationId = conversation.conversationId;
        setStoredConversationId(plan.planId, nextConversationId);
        history = await getConversationMessages(plan.planId, nextConversationId);
      }

      if (!active) return;
      setPlanId(plan.planId);
      setConversationId(nextConversationId);
      const planItems = areas.flatMap((area) => area.items);
      const nextMessages = history?.messages ?? [];
      // 계획 홈의 수정 버튼으로 진입하면 전체 계획을 최신 채팅 결과처럼 바로 보여줍니다.
      const showPlans = new URLSearchParams(window.location.search).get("showPlans") === "true";
      setMessages(showPlans && planItems.length > 0 ? [...nextMessages, {
        messageId: -Date.now(),
        role: "ASSISTANT",
        content: JSON.stringify({ type: "RESULT", notice: "작성된 전체 계획을 불러왔어요." }),
        createdAt: new Date().toISOString(),
      }] : nextMessages);
      setItems(planItems);
    }).catch((error) => active && setErrorMessage(getApiErrorMessage(error, "계획 대화를 불러오지 못했습니다.")));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    // 새 메시지가 생기면 그 메시지에 포함된 카드까지 입력창 바로 위에 오도록 이동합니다.
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // API 처리 결과의 최신 카드로 목록의 동일 항목을 교체합니다.
  const replaceItem = (updated: PlanItem) => {
    setItems((current) => current.map((item) => item.itemId === updated.itemId ? updated : item));
  };

  // 서버의 삶의 구역별 항목을 다시 조회해 오래된 로컬 카드 상태를 완전히 교체합니다.
  const synchronizePlanItems = async () => {
    if (planId == null) return;
    const areas = await getLifeAreas(planId);
    setItems(areas.flatMap((area) => area.items));
  };

  const handleApprove = async (itemId: number) => {
    if (planId == null || busyItemId != null) return;
    setBusyItemId(itemId); setErrorMessage("");
    try { replaceItem(await approvePlanItem(planId, itemId)); }
    catch (error) {
      // 서버에 없는 오래된 itemId였다면 재조회 결과에서 해당 카드를 제거합니다.
      try { await synchronizePlanItems(); } catch { /* 원래 승인 오류를 우선 표시합니다. */ }
      setErrorMessage(getApiErrorMessage(error, "계획을 승인하지 못했습니다."));
    }
    finally { setBusyItemId(null); }
  };

  const handleUpdate = async (itemId: number, request: PlanItemUpdateRequest) => {
    if (planId == null || busyItemId != null) return false;
    setBusyItemId(itemId); setErrorMessage("");
    try {
      replaceItem(await updatePlanItem(planId, itemId, request));
      return true;
    }
    catch (error) {
      try { await synchronizePlanItems(); } catch { /* 원래 수정 오류를 우선 표시합니다. */ }
      setErrorMessage(getApiErrorMessage(error, "계획을 수정하지 못했습니다."));
      return false;
    }
    finally { setBusyItemId(null); }
  };

  const handleDelete = async (itemId: number) => {
    if (planId == null || busyItemId != null || !window.confirm("이 계획을 완전히 삭제할까요?")) return;
    setBusyItemId(itemId); setErrorMessage("");
    try { await deletePlanItem(planId, itemId); setItems((current) => current.filter((item) => item.itemId !== itemId)); }
    catch (error) {
      try { await synchronizePlanItems(); } catch { /* 원래 삭제 오류를 우선 표시합니다. */ }
      setErrorMessage(getApiErrorMessage(error, "계획을 삭제하지 못했습니다."));
    }
    finally { setBusyItemId(null); }
  };

  // type=QUESTION은 AI 말풍선으로, type=RESULT는 서버가 구조화한 계획 카드로 반영합니다.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = message.trim();
    if (!content || pending || planId == null || conversationId == null) return;
    setPending(true); setMessage(""); setErrorMessage("");
    // 제출 직후 다시 포커스를 주고, 응답 대기 중에도 다음 메시지를 입력할 수 있게 합니다.
    requestAnimationFrame(() => messageInputRef.current?.focus());
    setMessages((current) => [...current, { messageId: Date.now(), role: "USER", content, createdAt: new Date().toISOString() }]);
    try {
      const turn = await sendConversationMessage(planId, conversationId, content);
      if (turn.type === "QUESTION" && turn.question) {
        setMessages((current) => [...current, { messageId: Date.now() + 1, role: "ASSISTANT", content: turn.question!, createdAt: new Date().toISOString() }]);
      } else if (turn.type === "RESULT") {
        const received = turn.items ?? [];
        // RESULT 원본을 메시지에 함께 보관해 생성 시점에 카드를 끼워 넣습니다.
        setMessages((current) => [...current, {
          messageId: Date.now() + 1,
          role: "ASSISTANT",
          content: JSON.stringify({ type: "RESULT", items: received }),
          createdAt: new Date().toISOString(),
        }]);
        try {
          // AI 결과의 임시 데이터 대신 백엔드가 최종 저장한 itemId와 상태를 다시 가져옵니다.
          await synchronizePlanItems();
        } catch (syncError) {
          setErrorMessage(getApiErrorMessage(syncError, "계획은 반영됐지만 최신 카드를 불러오지 못했습니다."));
        }
      } else throw new Error(`지원하지 않는 대화 응답 형식입니다: ${String(turn.type)}`);
    } catch (error) { setErrorMessage(getApiErrorMessage(error, "메시지를 전송하지 못했습니다.")); }
    finally {
      setPending(false);
      requestAnimationFrame(() => messageInputRef.current?.focus());
    }
  };

  // 전체 계획 카드는 반복하지 않고 가장 최근 계획 반영 RESULT 아래에만 배치합니다.
  const latestResultMessageId = [...messages].reverse().find((entry) =>
    getAssistantPayload(entry)?.type === "RESULT",
  )?.messageId;

  return <PageContainer className="gap-[22px] scroll-pb-[240px] pb-0 pt-[70px]">
    <PageHeader title="계획 작성" backHref="/plan" backLabel="계획 홈으로 돌아가기" className="pb-5" />
    {messages.length === 0 && <div className="self-start rounded-[30px] bg-[#d5d5d5] px-[22px] py-[18px] text-sm font-semibold">대화하듯 편하게 계획을 말씀해 주세요.</div>}
    {messages.map((entry) => {
      return <section className="flex w-full flex-col gap-[22px]" key={entry.messageId}>
        <div className={`max-w-[85%] rounded-[30px] px-[22px] py-[18px] text-sm leading-6 ${entry.role === "USER" ? "self-end bg-white" : "self-start bg-[#d5d5d5] font-semibold"}`}>{getMessageContent(entry)}</div>
        {entry.messageId === latestResultMessageId && items.length > 0 && <>
          <div className="grid w-full gap-[22px] lg:grid-cols-3">{items.map((item, index) => <PlanItemCard busy={busyItemId === item.itemId} displayOrder={index + 1} item={item} key={item.itemId} onApprove={() => handleApprove(item.itemId)} onDelete={() => handleDelete(item.itemId)} onSave={(request) => handleUpdate(item.itemId, request)} />)}</div>
          <Button className="md:h-[52px]" href="/manager">역할 담당자 등록하기</Button>
        </>}
      </section>;
    })}
    {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
    <div aria-hidden className="h-[120px] w-full shrink-0" ref={chatEndRef} />
    <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[390px] px-6 pb-6 md:left-[140px] md:right-[140px] md:w-auto md:max-w-none md:px-0"><form className="flex rounded-[30px] bg-white px-[22px] py-3.5 shadow" onSubmit={handleSubmit}><input ref={messageInputRef} aria-label="계획 메시지" className="min-w-0 flex-1 bg-transparent text-sm outline-none" disabled={conversationId == null} onChange={(event) => setMessage(event.target.value)} placeholder={pending ? "답변을 기다리는 동안 다음 내용을 입력할 수 있어요" : "계획 내용을 입력해 주세요"} value={message} /><button aria-label="메시지 보내기" disabled={pending || !message.trim()} type="submit"><Image src="/icons/plan/paper-plane-tilt.svg" alt="" width={24} height={24} /></button></form></div>
  </PageContainer>;
}

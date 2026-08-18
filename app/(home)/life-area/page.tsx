// AI 대화와 계획 카드를 표시하고 카드 승인·수정·삭제를 서버와 동기화하는 화면입니다.

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
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
  ApiId,
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

const disclosureScopes = [
  { label: "가족", value: "FAMILY" },
  { label: "업무", value: "WORK" },
  { label: "관계", value: "RELATIONSHIP" },
] as const;

function AutoResizeTextarea({
  ariaLabel,
  className = "",
  onChange,
  value,
}: {
  ariaLabel: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return <textarea
    aria-label={ariaLabel}
    className={`resize-none overflow-hidden rounded-xl bg-white px-3 py-2 text-sm outline-none ${className}`}
    onChange={onChange}
    ref={textareaRef}
    rows={1}
    value={value}
  />;
}

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
    <article className="flex w-full flex-col gap-7 rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] bg-[#fbfafd] px-[22px] pb-7 pt-[22px] md:max-w-[367px] md:px-[26px]">
      <div className="flex items-start justify-between">
        <span className="flex size-[26px] items-center justify-center rounded-full border-[1.5px] border-[#7f62b8] text-[13px] font-medium leading-none text-[#7f62b8]">{displayOrder}</span>
        <button aria-label={`계획 ${displayOrder} 취소`} className="flex size-[26px] items-center justify-center rounded-md transition-colors hover:bg-[#f3f3ff] disabled:cursor-not-allowed disabled:opacity-50" disabled={busy} onClick={onDelete} type="button">
          <Image alt="" height={26} src="/icons/plan/trash.svg" width={26} />
        </button>
      </div>

      {editing ? (
        <div className="flex flex-col gap-3">
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="계획 제목" value={draft.title} onChange={(event) => change("title", event.target.value)} />
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="계획 대상" placeholder="대상 이름" value={draft.targetName} onChange={(event) => change("targetName", event.target.value)} />
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="자료 위치 유형" placeholder="자료 위치 유형" value={draft.locationType} onChange={(event) => change("locationType", event.target.value)} />
          <AutoResizeTextarea ariaLabel="계획 내용" className="min-h-20" value={draft.content} onChange={(event) => change("content", event.target.value)} />
          <AutoResizeTextarea ariaLabel="수행 행동" className="min-h-16" value={draft.action} onChange={(event) => change("action", event.target.value)} />
          <input className="rounded-xl bg-white px-3 py-2 text-sm" aria-label="선행 조건" placeholder="선행 조건(선택)" value={draft.precondition} onChange={(event) => change("precondition", event.target.value)} />
          <div className="flex flex-col gap-2.5" role="group" aria-label="공개 범위">
            <span className="px-2.5 text-sm font-semibold">공개 범위</span>
            <div className="grid grid-cols-3 gap-2.5">
              {disclosureScopes.map((scope) => {
                const selected = draft.disclosureScope === scope.value;
                return <button
                  aria-pressed={selected}
                  className={`h-[45px] rounded-[20px] text-sm transition-colors ${selected ? "bg-[#838383] font-semibold text-white" : "bg-white text-[#a8a8a8] hover:bg-[#e4e4e6]"}`}
                  key={scope.value}
                  onClick={() => change("disclosureScope", scope.value)}
                  type="button"
                >{scope.label}</button>;
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-7">
          {item.sourceExcerpt && <div className="flex flex-col gap-2.5"><strong className="text-sm font-bold text-[#43306d] md:text-base">원문 근거</strong><p className="line-clamp-2 text-[13px] font-medium leading-normal text-[#28292e] md:text-[15px]">{item.sourceExcerpt}</p></div>}
          <div className="flex flex-col gap-2.5"><h2 className="text-sm font-bold text-[#43306d] md:text-base">{item.title}</h2><p className="text-[13px] font-medium leading-normal text-[#838383] md:text-[15px]">{item.content || item.action}</p></div>
        </div>
      )}

      <div className={editing ? "grid grid-cols-3 gap-2" : "flex flex-col gap-3.5"}>
        {editing ? <>
          <button className="col-span-2 h-10 rounded-[20px] bg-[#838383] text-sm text-white disabled:opacity-50" disabled={busy || !canSave} onClick={save} type="button">저장</button>
          <button className="h-10 rounded-[20px] bg-white text-sm" disabled={busy} onClick={() => setEditing(false)} type="button">취소</button>
        </> : <>
          <button className="min-h-[48px] rounded-[14px] bg-[#3c2b62] px-5 py-[14px] text-sm font-medium leading-none text-[#fbfafd] disabled:opacity-50 md:text-base" disabled={busy || item.status === "APPROVED"} onClick={onApprove} type="button">{item.status === "APPROVED" ? "승인 완료" : "승인하기"}</button>
          <button className="min-h-[48px] rounded-[14px] bg-[#7f62b8] px-5 py-[14px] text-sm font-medium leading-none text-[#fbfafd] disabled:opacity-50 md:text-base" disabled={busy} onClick={() => setEditing(true)} type="button">수정하기</button>
        </>}
      </div>
    </article>
  );
}

export default function LifeAreaPage() {
  const router = useRouter();
  const [planId, setPlanId] = useState<ApiId | null>(null);
  const [conversationId, setConversationId] = useState<ApiId | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [busyItemId, setBusyItemId] = useState<ApiId | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<ApiId | null>(null);
  const [openedFromPlanHome, setOpenedFromPlanHome] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromPlanHome = new URLSearchParams(window.location.search).get("from") === "plan";
    queueMicrotask(() => setOpenedFromPlanHome(fromPlanHome));
  }, []);

  useEffect(() => {
    let active = true;
    // 저장된 conversationId가 있으면 백엔드 이력을 복구하고, 없거나 무효할 때만 새 세션을 만듭니다.
    getMyPlan().then(async (plan) => {
      const areas = await getLifeAreas(plan.planId);
      let nextConversationId: ApiId | null = getStoredConversationId(plan.planId);
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

  const handleApprove = async (itemId: ApiId) => {
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

  const handleUpdate = async (itemId: ApiId, request: PlanItemUpdateRequest) => {
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

  const handleDelete = async (itemId: ApiId) => {
    if (planId == null || busyItemId != null) return;
    setDeleteTargetId(null);
    setBusyItemId(itemId); setErrorMessage("");
    try { await deletePlanItem(planId, itemId); setItems((current) => current.filter((item) => item.itemId !== itemId)); }
    catch (error) {
      try { await synchronizePlanItems(); } catch { /* 원래 삭제 오류를 우선 표시합니다. */ }
      setErrorMessage(getApiErrorMessage(error, "계획을 삭제하지 못했습니다."));
    }
    finally { setBusyItemId(null); }
  };

  const handleRegisterRecipients = () => {
    if (items.some((item) => item.status !== "APPROVED")) {
      setErrorMessage("모든 계획을 승인해야 역할 담당자를 지정할 수 있습니다.");
      return;
    }

    setErrorMessage("");
    router.push("/manager");
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

  return <PageContainer className="gap-3 scroll-pb-[180px] pb-0 pt-[70px] md:!px-[120px] md:!pt-0">
    <PageHeader title="대화 작성" backHref="/plan" backLabel="계획 홈으로 돌아가기" className="mx-auto max-w-[342px] items-center px-1 py-2 md:max-w-[460px] md:px-0 md:py-0" />

    <aside className="flex w-full flex-col items-start rounded-[16px] bg-[#f3f3ff] px-5 pb-[22px] pt-[18px] md:hidden">
      <div className="flex flex-col gap-2.5">
        <Image src="/icons/life-area-warning.svg" alt="" width={24} height={24} className="size-6" />
        <h2 className="text-sm font-bold leading-none text-[#43306d]">중요한 내용</h2>
        <p className="text-xs font-medium leading-normal text-[#796b6c]">비밀번호, 인증번호 같은 민감한 내용은 적지 마세요.<br />위치 유형만 알려주세요.</p>
      </div>
    </aside>

    <aside className="mx-auto hidden w-[342px] items-center justify-center rounded-[16px] bg-[#fbfafd] px-6 py-4 text-center md:flex">
      <p className="text-lg font-bold leading-normal text-[#43306d]">비밀번호·PIN·인증번호는 적지 마세요.<br />위치 유형만 알려주세요.</p>
    </aside>

    <div className="mx-auto flex w-full flex-1 flex-col items-center pt-2 md:max-w-[460px] md:pt-[30px]">
      <div className="flex w-full flex-col gap-3 md:gap-10">
        <div className="self-start rounded-br-[14px] rounded-bl-[14px] rounded-tr-[14px] bg-[#fbfafd] px-[22px] py-[18px] text-[13px] font-medium leading-normal text-[#43306d] md:text-[15px]">대화하듯 편하게 계획을 말씀해 주세요.</div>
        {messages.map((entry) => {
          return <section className="flex w-full flex-col gap-[22px] md:gap-10" key={entry.messageId}>
            <div className={`whitespace-pre-wrap px-[22px] py-[18px] text-[13px] font-medium leading-normal md:text-[15px] ${entry.role === "USER" ? "self-end rounded-bl-[14px] rounded-br-[14px] rounded-tl-[14px] bg-[#43306d] text-[#fbfafd] md:w-full md:px-[30px] md:py-5" : "max-w-[85%] self-start rounded-bl-[14px] rounded-br-[14px] rounded-tr-[14px] bg-[#fbfafd] text-[#43306d]"}`}>{getMessageContent(entry)}</div>
            {entry.messageId === latestResultMessageId && items.length > 0 && <>
              <div className="grid w-full gap-[22px]">{items.map((item, index) => <PlanItemCard busy={busyItemId === item.itemId} displayOrder={index + 1} item={item} key={item.itemId} onApprove={() => handleApprove(item.itemId)} onDelete={() => setDeleteTargetId(item.itemId)} onSave={(request) => handleUpdate(item.itemId, request)} />)}</div>
              <div className="self-start rounded-bl-[14px] rounded-br-[14px] rounded-tr-[14px] bg-[#fbfafd] px-[22px] py-[18px] text-[13px] font-medium leading-normal text-[#43306d] md:text-[15px]">역할 등록 순서가 맞으면 하단의 버튼을 눌러주세요</div>
              <Button onClick={openedFromPlanHome ? () => router.push("/plan") : handleRegisterRecipients} type="button">
                {openedFromPlanHome ? "홈 화면으로 이동하기" : "역할 담당자 등록하기"}
              </Button>
            </>}
          </section>;
        })}
        {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
      </div>
      <div aria-hidden className="h-[150px] w-full shrink-0" ref={chatEndRef} />
    </div>

    <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[390px] px-6 pb-6 md:max-w-[460px] md:px-0 md:pb-[50px]">
      <p className="mb-2.5 text-center text-[13px] font-medium leading-none text-[#796b6c] md:text-[15px]">작성하신 내용은 AI가 읽고 정리해요.</p>
      <form className="flex items-center rounded-[16px] border-[1.4px] border-[#d7d0d0] bg-[#fbfafd] px-[22px] py-[14px] md:py-4" onSubmit={handleSubmit}>
        <input ref={messageInputRef} aria-label="계획 메시지" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#584e4d] outline-none placeholder:text-[#796b6c] md:text-[15px]" onChange={(event) => setMessage(event.target.value)} placeholder={pending ? "답변을 기다리는 동안 다음 내용을 입력할 수 있어요" : "추가하고 싶은 내용을 입력해 주세요"} value={message} />
        <button aria-label="메시지 보내기" className="ml-3 shrink-0 disabled:cursor-not-allowed" disabled={pending || !message.trim() || planId == null || conversationId == null} type="submit"><Image src="/icons/life-area-send.svg" alt="" width={24} height={24} className="size-[22px] md:size-6" /></button>
      </form>
    </div>
    {deleteTargetId != null && (
      <ConfirmationDialog
        confirmLabel="삭제하기"
        description={<>삭제한 계획은 다시 복구할 수 없어요.<br />정말 삭제할 계획인지 확인해 주세요.</>}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => void handleDelete(deleteTargetId)}
        title="이 계획을 삭제할까요?"
      />
    )}
  </PageContainer>;
}

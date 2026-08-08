"use client";

// 계획의 세부 내용을 대화 형식으로 확인하고 추가 내용을 입력하는 반응형 화면입니다.
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/shared/ui/BackButton";
import { StructuredPlanCard } from "./components/StructuredPlanCard";
import { mockStructuredPlans } from "./data/mockStructuredPlans";

// AI가 보낸 메시지 말풍선에 공통으로 적용하는 스타일입니다.
const assistantBubbleClassName =
  "self-start rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] bg-[#d5d5d5] px-[22px] py-[18px] text-sm font-semibold text-[#28292e] lg:px-[30px] lg:py-5 lg:text-base";

// 사용자가 보낸 메시지 말풍선에 공통으로 적용하는 스타일입니다.
const userBubbleClassName =
  "self-end rounded-bl-[30px] rounded-br-[30px] rounded-tl-[30px] bg-white px-[22px] py-[18px] text-sm text-[#28292e] lg:px-[30px] lg:py-5 lg:text-base";

// 계획 내용을 대화 형식으로 확인·보완하고 구조화된 결과를 보여줍니다.
export function LifeAreaConversation() {
  const [socialAction, setSocialAction] = useState("비공개");
  const [message, setMessage] = useState("");
  const [additionalMessages, setAdditionalMessages] = useState<string[]>([]);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때 대화의 마지막 항목이 보이도록 스크롤합니다.
  useEffect(() => {
    if (additionalMessages.length === 0) return;

    conversationEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [additionalMessages.length]);

  // 공백 메시지를 제외한 사용자 입력을 대화 목록에 추가합니다.
  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextMessage = message.trim();

    if (!nextMessage) return;

    setAdditionalMessages((current) => [...current, nextMessage]);
    setMessage("");
  };

  return (
    <section className="mx-auto flex h-dvh w-full max-w-[390px] flex-col gap-[22px] overflow-hidden px-6 pb-[50px] pt-[70px] lg:h-[calc(100vh-125px)] lg:max-w-none lg:px-0 lg:pb-20 lg:pt-0">
      <header className="flex w-full shrink-0 items-start justify-between pb-5 lg:px-[60px] lg:pb-0">
        <BackButton href="/plan/write" label="계획 작성 화면으로 돌아가기" />
        <h1 className="text-lg font-bold text-[#28292e] lg:text-xl">대화 작성</h1>
        <span className="size-6 lg:size-7" aria-hidden />
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:px-[120px]">
        <div className="-mx-6 flex min-h-0 flex-1 flex-col gap-[22px] overflow-y-auto px-6 pb-[22px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-[120px] lg:px-[120px]">
          <div className={`${userBubbleClassName} max-w-[294px] lg:max-w-[720px]`}>
            <p>아내에게 가족사진 위치를 알려주고, 민수에게 디자인 프로젝트를 인계한 뒤,</p>
            <p className="mt-2">지수에게 SNS와 클라우드 정리를 부탁하고 싶어요.</p>
          </div>

          <div className={assistantBubbleClassName}>가족 사진은 어디에 위치하고 있나요?</div>

          <div className={userBubbleClassName}>클라우드 보관함 2번째 파일에 있어요.</div>

          <div className={`${assistantBubbleClassName} flex flex-col gap-3.5`}>
            <p>SNS는 어떻게 정리할까요?</p>
            <div className="flex gap-2">
              {["삭제", "비공개"].map((option) => {
                const selected = socialAction === option;

                return (
                  <button
                    aria-pressed={selected}
                    className={`rounded-[30px] border-[1.6px] bg-white px-5 py-3 text-sm transition-colors ${selected ? "border-[#838383] font-semibold text-[#838383]" : "border-transparent text-[#a8a8a8] hover:bg-[#eeeeef]"}`}
                    key={option}
                    onClick={() => setSocialAction(option)}
                    type="button"
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={userBubbleClassName}>{socialAction} 처리 할게요.</div>

          {additionalMessages.map((additionalMessage, index) => (
            <div
              className={userBubbleClassName}
              key={`${additionalMessage}-${index}`}
            >
              {additionalMessage}
            </div>
          ))}

          <div className={assistantBubbleClassName}>
            <p>작성한 대화를 바탕으로 3가지 사항을 계획 수정 및</p>
            <p className="mt-2">추가 완료했어요.</p>
          </div>

          <div className="grid w-full grid-cols-1 gap-[18px] lg:grid-cols-3 lg:gap-[30px]">
            {mockStructuredPlans.map((plan) => (
              <StructuredPlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          <div className={assistantBubbleClassName}>
            <p>내용을 수정하고 삭제하려면 각 내용의 하단에</p>
            <p className="mt-2">버튼을 눌러주세요.</p>
          </div>
          <div className="h-px shrink-0 scroll-mb-[18px]" ref={conversationEndRef} aria-hidden />
        </div>

        <form className="flex w-full shrink-0 items-center rounded-[30px] bg-white px-[22px] py-3.5" onSubmit={sendMessage}>
          <input
            aria-label="추가할 내용"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#28292e] outline-none placeholder:text-[#a8a8a8] lg:text-base"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="수정하고 싶은 내용을 입력해 주세요"
            type="text"
            value={message}
          />
          <button aria-label="메시지 보내기" className="ml-3 size-6 shrink-0" type="submit">
            <Image src="/icons/plan/paper-plane-tilt.svg" alt="" width={24} height={24} />
          </button>
        </form>
      </div>
    </section>
  );
}

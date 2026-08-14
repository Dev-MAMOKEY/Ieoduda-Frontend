"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const results = [
  {
    id: 1,
    icon: "/icons/life-area/one.svg",
    source: "가족에게 가족사진 위치를 알려주고...",
    title: "가족에게 전달하는 메시지",
    detail: "가족 사진은 클라우드 보관함 2번째 파일에 있어.",
  },
  {
    id: 2,
    icon: "/icons/life-area/two.svg",
    source: "업무정리 담당자에게 디자인 프로젝트를 인계한...",
    title: "업무 정리",
    detail: "디자인 프로젝트 인수인계",
  },
  {
    id: 3,
    icon: "/icons/life-area/three.svg",
    source: "관계 정리 담당자에게 SNS와 클라우드 정리를 부탁...",
    title: "관계정리",
    detail: "SNS · 클라우드 비공개 처리",
  },
];

function ResultCard({ result, approved, onApprove }) {
  return (
    <article className="flex h-full w-[328px] max-w-full min-w-0 flex-col gap-[19px] rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] bg-[#d5d5d5] px-[22px] py-5 md:w-full md:max-w-none md:gap-3 md:px-[30px] md:py-5">
      <div className="flex flex-col gap-2 md:gap-1.5">
        <Image src={result.icon} alt={`${result.id}번`} width={24} height={24} />
        <span className="text-sm font-medium text-[#838383]">원문 근거</span>
        <p className="truncate text-sm">{result.source}</p>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 text-sm md:gap-1.5">
        <strong>{result.title}</strong>
        <span className="font-medium text-[#838383]">{result.detail}</span>
      </div>

      <div className="grid w-full grid-cols-3 gap-3.5 md:gap-3">
        <button
          aria-pressed={approved}
          className={`flex h-[45px] w-full min-w-0 items-center justify-center whitespace-nowrap rounded-[20px] px-2 text-sm text-white transition-colors md:h-10 ${approved ? "bg-[#5f6065] font-semibold ring-2 ring-inset ring-[#28292e]/20" : "bg-[#a8a8a8] hover:bg-[#929292]"}`}
          onClick={onApprove}
          type="button"
        >
          {approved ? "승인됨" : "승인"}
        </button>
        <button className="h-[45px] w-full min-w-0 whitespace-nowrap rounded-[20px] bg-[#a8a8a8] px-2 text-sm text-white hover:bg-[#929292] md:h-10" type="button">수정</button>
        <button className="h-[45px] w-full min-w-0 whitespace-nowrap rounded-[20px] bg-[#a8a8a8] px-2 text-sm text-white hover:bg-[#929292] md:h-10" type="button">삭제</button>
      </div>
    </article>
  );
}

export default function LifeAreaPage() {
  const [approvedIds, setApprovedIds] = useState([]);
  const [message, setMessage] = useState("");

  const toggleApproval = (id) => {
    setApprovedIds((current) =>
      current.includes(id)
        ? current.filter((approvedId) => approvedId !== id)
        : [...current, id],
    );
  };

  return (
    <PageContainer className="gap-[22px] scroll-pb-[240px] pb-0 pt-[70px] md:gap-7 md:scroll-pb-[280px] md:pb-0" data-node-id="439:1396">
      <PageHeader title="계획 작성" backHref="/plan" backLabel="직전 화면으로 돌아가기" history className="pb-5" />

      <div className="self-start rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] bg-[#d5d5d5] px-[22px] py-[18px] text-sm font-semibold md:px-[30px] md:py-5 md:text-base">
        대화하듯 편하게 계획을 말씀해 주세요.
      </div>

      <div className="max-w-[290px] self-end rounded-bl-[30px] rounded-br-[30px] rounded-tl-[30px] bg-white px-[22px] py-[18px] text-sm leading-6 md:max-w-[65%] md:px-[30px] md:py-5 md:text-base">
        가족에게 가족사진 위치를 알려주고, 업무 정리 담당자에게 디자인 프로젝트를 인계한 뒤, 관계 정리 담당자에게 SNS와 클라우드 정리를 부탁하고 싶어요.
      </div>

      <div className="self-start rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] bg-[#d5d5d5] px-[22px] py-[18px] text-sm font-semibold leading-6 md:px-[30px] md:py-5 md:text-base">
        작성한 대화를 바탕으로 3가지 사항을 계획 수정 및 추가 완료했어요.
      </div>

      <div className="grid w-full grid-cols-1 items-stretch gap-[22px] lg:grid-cols-3 lg:gap-5">
        {results.map((result) => (
          <ResultCard
            approved={approvedIds.includes(result.id)}
            key={result.id}
            onApprove={() => toggleApproval(result.id)}
            result={result}
          />
        ))}
      </div>

      <div className="self-start rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] bg-[#d5d5d5] px-[22px] py-[18px] text-sm font-semibold md:px-[30px] md:py-5 md:text-base">
        역할 등록 순서가 맞으면 하단의 버튼을 눌러주세요
      </div>

      <div className="w-full shrink-0">
        <Button className="md:h-[52px]" href="/manager">역할별 담당자 등록하기</Button>
      </div>

      <div aria-hidden className="h-[100px] w-full shrink-0 md:h-[100px]" />

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[390px] bg-gradient-to-t from-[#f0f0f2] via-[#f0f0f2] to-transparent px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 md:left-[140px] md:right-[140px] md:w-auto md:max-w-none md:px-0 md:pb-[50px] md:pt-8">
        <form className="flex w-full items-center justify-between rounded-[30px] bg-white px-[22px] py-3.5 shadow-[0_4px_20px_rgba(40,41,46,0.06)]" onSubmit={(event) => event.preventDefault()}>
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#a8a8a8]"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="수정하고 싶은 내용을 입력해 주세요"
            type="text"
            value={message}
          />
          <button className="ml-3 size-6 shrink-0" aria-label="메시지 보내기" type="submit">
            <Image src="/icons/plan/paper-plane-tilt.svg" alt="" width={24} height={24} />
          </button>
        </form>
      </div>
    </PageContainer>
  );
}

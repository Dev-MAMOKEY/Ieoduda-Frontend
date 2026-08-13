"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const waitingPeriods = ["7일", "14일", "21일"];

function TextInput({ id, name, placeholder, type = "text", defaultValue }) {
  return (
    <input
      className="h-[45px] w-full rounded-[20px] border-0 bg-white px-5 text-sm font-normal outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 focus-visible:ring-[#a8a8a8]/50"
      defaultValue={defaultValue}
      id={id}
      name={name}
      placeholder={placeholder}
      type={type}
    />
  );
}

function NoticeCard({ title, children }) {
  return (
    <aside className="flex w-full flex-col items-start rounded-[20px] bg-[#d9d9d9] px-5 pb-[22px] pt-[18px]">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <Image alt="" height={22} src="/icons/settings/warning-circle.svg" width={22} />
          <h2 className="text-[13px] font-bold leading-normal">{title}</h2>
        </div>
        {children}
      </div>
    </aside>
  );
}

export default function AppealPage() {
  const [waitingPeriod, setWaitingPeriod] = useState(null);

  const toggleWaitingPeriod = (period) => {
    setWaitingPeriod((current) => current === period ? null : period);
  };

  return (
    <PageContainer className="gap-[22px] py-[70px]" data-node-id="439:2193">
      <PageHeader
        backHref="/profile"
        backLabel="설정 화면으로 돌아가기"
        className="pb-5"
        title="대기 이의제기"
      />

      <section className="flex w-full flex-col gap-3.5">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-bold">본인 경고 이메일</h2>
          <span className="text-sm font-medium text-[#838383]">검증 필요</span>
        </div>
        <TextInput defaultValue="namu_k@gmail.com" id="warning-email" name="warningEmail" type="email" />
        <Button type="button">검증 메일 보내기</Button>
      </section>

      <section className="flex w-full flex-col gap-3.5">
        <h2 className="text-base font-bold">이의 제기 연락처</h2>
        <TextInput id="contact-name" name="contactName" placeholder="이름을 입력해 주세요" />
        <div className="pb-2.5">
          <TextInput id="contact-email" name="contactEmail" placeholder="이메일을 입력해 주세요" type="email" />
        </div>

        <section className="flex w-full flex-col gap-3.5">
          <h2 className="text-base font-bold">대기 기간</h2>
          <div className="grid w-full grid-cols-3 gap-2.5">
            {waitingPeriods.map((period) => (
              <button
                aria-pressed={waitingPeriod === period}
                className={`h-[45px] rounded-[20px] text-sm transition-colors ${waitingPeriod === period ? "bg-[#838383] font-semibold text-white" : "bg-white text-[#a8a8a8] hover:bg-[#e4e4e6]"}`}
                key={period}
                onClick={() => toggleWaitingPeriod(period)}
                type="button"
              >
                {period}
              </button>
            ))}
          </div>
        </section>
      </section>

      <Button href="/profile">대기 이의제기 등록하기</Button>

      <NoticeCard title="취소 절차 안내">
        <div className="flex flex-col gap-1 text-xs font-medium leading-normal text-[#838383]">
          <p>실행 신호가 오면, 먼저 본인에게 경고 메일이 가요.</p>
          <p>대기 기간 동안 본인·이의 제기 연락처가 취소할 수 있어요.</p>
        </div>
        <div className="flex flex-col gap-2.5 text-xs font-medium leading-normal">
          <div className="flex flex-col gap-1 pl-0.5">
            <strong className="font-medium text-[#28292e]">본인</strong>
            <p className="text-[#838383]">실행 직전 보내드리는 경고 메일의 &apos;멈추기&apos;를 누르면 중단돼요.</p>
          </div>
          <div className="flex flex-col gap-1 pl-0.5">
            <strong className="font-medium text-[#28292e]">이의 제기 연락처</strong>
            <p className="text-[#838383]">등록된 분도 대기 기간 동안 이의를 제기해 멈출 수 있어요.</p>
          </div>
        </div>
      </NoticeCard>

      <NoticeCard title="분쟁 시 자동 중지 안내">
        <div className="flex flex-col gap-1 text-xs font-medium leading-normal text-[#838383]">
          <p>이의나 분쟁이 접수되면 계획은 자동으로 멈추고, 실행되지 않아요.</p>
          <p>대기 기간이 끝나도 진행되지 않고, 문제가 확인·해결될 때까지</p>
          <p>그대로 멈춰 있어요.</p>
        </div>
      </NoticeCard>
    </PageContainer>
  );
}

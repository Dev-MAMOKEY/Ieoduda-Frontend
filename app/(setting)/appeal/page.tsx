"use client";
import Image from "next/image";
import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const periods = ["7일", "14일", "21일"];
const inputClass =
  "h-[45px] w-full rounded-[20px] border-0 bg-white px-5 text-sm outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 focus-visible:ring-[#a8a8a8]/50 lg:h-[52px] lg:text-base";
function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="flex flex-col gap-4 rounded-[20px] bg-[#d9d9d9] px-5 pb-6 pt-5">
      <div className="flex flex-col gap-2.5">
        <Image
          alt=""
          width={22}
          height={22}
          src="/icons/settings/warning-circle.svg"
        />
        <h2 className="text-[13px] font-bold lg:text-base">{title}</h2>
      </div>
      <div className="text-xs font-medium leading-relaxed text-[#838383] lg:text-sm">
        {children}
      </div>
    </aside>
  );
}

export default function AppealPage() {
  const [period, setPeriod] = useState<string | null>(null);
  return (
    <PageContainer
      className="gap-[22px] py-[70px] lg:max-w-none lg:gap-10 lg:px-[120px] lg:pb-[50px] lg:pt-0"
      data-node-id="439:3813"
    >
      <PageHeader
        backHref="/profile"
        backLabel="설정 화면으로 돌아가기"
        className="pb-5 lg:pb-0"
        title="대기 이의제기"
      />
      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-3.5">
          <div className="flex justify-between">
            <h2 className="text-base font-bold lg:text-lg">본인 경고 이메일</h2>
            <span className="text-sm font-medium text-[#838383]">
              검증 필요
            </span>
          </div>
          <input
            className={inputClass}
            defaultValue="namu_k@gmail.com"
            type="email"
          />
          <Button className="lg:h-[52px]" type="button">
            검증 메일 보내기
          </Button>
        </section>
        <section className="flex flex-col gap-3.5">
          <h2 className="text-base font-bold lg:text-lg">이의 제기 연락처</h2>
          <input className={inputClass} placeholder="이름을 입력해 주세요" />
          <input
            className={inputClass}
            placeholder="이메일을 입력해 주세요"
            type="email"
          />
        </section>
        <section className="flex flex-col gap-3.5">
          <h2 className="text-base font-bold lg:text-lg">대기 기간</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {periods.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() =>
                  setPeriod((current) => (current === p ? null : p))
                }
                className={`h-[45px] rounded-[20px] text-sm transition-colors ${period === p ? "bg-[#838383] font-semibold text-white" : "bg-white text-[#a8a8a8] hover:bg-[#e4e4e6]"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>
        <Button className="lg:h-[52px]" href="/appeal/edit">
          대기 이의제기 등록하기
        </Button>
        <div className="flex flex-col gap-[22px]">
          <Notice title="취소 절차 안내">
            <div className="flex flex-col gap-1">
              <p>실행 신호가 오면, 먼저 본인에게 경고 메일이 가요.</p>
              <p>대기 기간 동안 본인·이의 제기 연락처가 취소할 수 있어요.</p>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex flex-col gap-1 pl-0.5">
                <strong className="font-medium text-[#28292e]">본인</strong>
                <p>
                  실행 직전 보내드리는 경고 메일의 ‘멈추기’를 누르면 중단돼요.
                </p>
              </div>
              <div className="flex flex-col gap-1 pl-0.5">
                <strong className="font-medium text-[#28292e]">
                  이의 제기 연락처
                </strong>
                <p>등록된 분도 대기 기간 동안 이의를 제기해 멈출 수 있어요.</p>
              </div>
            </div>
          </Notice>
          <Notice title="분쟁 시 자동 중지 안내">
            <p>
              이의나 분쟁이 접수되면 계획은 자동으로 멈추고, 실행되지 않아요.
            </p>
            <p>
              대기 기간이 끝나도 진행되지 않고, 문제가 확인·해결될 때까지 그대로
              멈춰 있어요.
            </p>
          </Notice>
        </div>
      </div>
    </PageContainer>
  );
}

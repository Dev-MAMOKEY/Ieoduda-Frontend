// 지정 확인자 역할 수락 이메일 화면
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { useConfirmerInvitation } from "@/lib/hooks/use-invitation";

function RejectButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      className="flex min-h-11 w-full items-center justify-center rounded-[14px] bg-[#7f62b8] px-5 py-3.5 text-sm font-medium leading-none text-[#fbfafd] transition-colors hover:bg-[#7055a4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] lg:min-h-12 lg:text-base"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      거절하기
    </button>
  );
}

export default function VerifierAcceptPage() {
  const { invitation, loading, pending, canDecide, error, decide } = useConfirmerInvitation();
  const [inquiry, setInquiry] = useState("");
  const ownerName = invitation?.ownerName ?? "계획 작성자";
  const inviteeName = invitation?.confirmerName ?? "확인자";
  return (
    <main className="min-h-dvh text-[#43306d]">
      <header className="hidden h-[125px] items-center px-[120px] lg:flex">
        <BrandLogo />
      </header>

      <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
        <header className="mb-[22px] flex w-full items-center justify-center py-2 lg:mb-0 lg:py-0">
          <h1 className="text-lg font-bold leading-none lg:text-xl">역할 수락</h1>
        </header>

        <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-[30px]">
          <article className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-[18px] bg-[#fbfafd] px-5 pb-7 pt-[30px] text-center lg:gap-7 lg:rounded-[30px] lg:pb-[34px] lg:pt-9">
            <header className="flex flex-col items-center gap-3 lg:gap-3.5">
              <p className="text-sm font-bold leading-none text-[#584e4d] lg:text-base lg:text-[#796b6c]">{inviteeName}님에게</p>
              <Image alt="" className="size-6 lg:size-[26px]" height={26} src="/icons/email/envelope-open.svg" width={26} />
              <div className="flex flex-col items-center gap-1.5 text-lg font-bold leading-none lg:text-xl">
                <p>{ownerName}님이</p>
                <p>당신에게 부탁을 남겼어요</p>
              </div>
            </header>

            <h2 className="text-base font-bold leading-none lg:text-lg">지정 확인자</h2>

            <div className="flex flex-col items-center gap-2 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
              <p>{ownerName}님이 세상을 떠난 뒤,</p>
              <p>그 사실을 대신 확인해 줄 사람으로 지정했어요.</p>
            </div>

            <div className="flex flex-col items-center gap-2 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
              <p>할 일은 딱 하나예요.</p>
              <p>그 날이 왔을 때, 사실이 맞는지 확인해 주세요.</p>
            </div>

            <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">그 전까지는 아무 일 없어요.</p>

            <div className="flex flex-col items-center gap-1.5 text-sm font-bold leading-none lg:block lg:text-base lg:font-semibold lg:leading-normal">
              <p>무엇을 정리할지는 다른 사람이 맡아요.</p>
              <p>사실 확인만 도와주면 돼요.</p>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-[14px] bg-[#eeecee] px-5 py-[18px] lg:gap-3 lg:rounded-[20px]">
              <Image alt="" className="size-5 lg:size-[26px]" height={26} src="/icons/email/lock.svg" width={26} />
              <p className="text-[13px] font-medium leading-none lg:text-base lg:font-semibold">실제 내용은 지금 확인할 수 없어요.</p>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
              <p>혼자 정하지 않아요.</p>
              <p>다른 확인자 한 분과 함께,</p>
              <p>각자 독립적으로 확인하게 돼요.</p>
            </div>
          </article>

          <label className="flex w-full flex-col gap-2.5">
            <span className="px-2.5 text-sm font-bold leading-none lg:px-0 lg:text-base">문의 사항</span>
            <input
              className="min-h-11 w-full rounded-[14px] border-0 bg-[#fbfafd] px-4 py-3.5 text-[13px] font-medium leading-none text-[#584e4d] outline-none placeholder:text-[#a99d9e] focus-visible:ring-2 focus-visible:ring-[#43306d]/25 lg:min-h-12 lg:rounded-[20px] lg:px-5 lg:text-[15px]"
              onChange={(event) => setInquiry(event.target.value)}
              placeholder="문의 사항을 작성해 주세요"
              value={inquiry}
            />
          </label>

          <section className="flex flex-col items-center gap-5 pb-3.5 pt-2.5 lg:gap-6 lg:p-0">
            <div className="flex flex-col items-center gap-1.5 text-[13px] font-medium leading-none text-[#796b6c] lg:gap-2 lg:text-[15px]">
              <p>수락 여부를 선택해 주세요</p>
              <p>부담이 된다면 거절해도 괜찮아요</p>
            </div>
            <div className="flex w-full flex-col gap-3.5 lg:gap-[22px]">
              <Button disabled={loading || pending || !canDecide} onClick={() => void decide("accept", inquiry)} type="button">{invitation?.acceptanceStatus === "ACCEPTED" ? "수락 완료" : "역할 수락하기"}</Button>
              <RejectButton disabled={loading || pending || !canDecide} onClick={() => void decide("decline", inquiry)} />
            </div>
            {invitation?.acceptanceStatus === "ACCEPTED" && <p className="text-sm font-medium text-[#43306d]" role="status">역할 수락이 완료되었습니다.</p>}
            {invitation?.acceptanceStatus === "DECLINED" && <p className="text-sm font-medium text-[#796b6c]" role="status">역할을 거절했습니다.</p>}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </section>

          <footer className="flex flex-col items-center gap-[9px] pt-2 text-center text-xs leading-none text-[#796b6c] lg:gap-3 lg:text-sm">
            <p>이 링크는 {invitation?.email ?? "초대받은 이메일"}로 발송되었으며, 7일 뒤 만료돼요.</p>
            <p>
              궁금한 점은 문의해 주세요.{" "}
              <Link className="text-[#584e4d] underline underline-offset-2" href="mailto:support@ieoduda.com">문의하기</Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}

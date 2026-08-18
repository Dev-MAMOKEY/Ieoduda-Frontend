// 대체 담당자 수락 이메일 화면
"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { useRecipientInvitation } from "@/lib/hooks/use-invitation";

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

export default function BackupAcceptPage() {
  const { invitation, loading, pending, error, decide } = useRecipientInvitation();
  const ownerName = invitation?.ownerName ?? "계획 작성자";
  const inviteeName = invitation?.assigneeName ?? "대체 담당자";
  return (
    <main className="min-h-dvh text-[#43306d]">
      <header className="hidden h-[125px] items-center px-[120px] lg:flex">
        <BrandLogo />
      </header>

      <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-20 lg:pt-0">
        <header className="mb-[22px] flex w-full items-center justify-center py-2 lg:mb-0 lg:py-0">
          <h1 className="text-lg font-bold leading-none lg:text-xl">역할 수락</h1>
        </header>

        <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-[30px]">
          <article className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-[10px] bg-[#fbfafd] px-5 pb-7 pt-[30px] text-center lg:gap-7 lg:rounded-[30px] lg:pb-[34px] lg:pt-9">
            <header className="flex flex-col items-center gap-3 lg:gap-3.5">
              <p className="text-sm font-bold leading-none text-[#584e4d] lg:text-base lg:text-[#796b6c]">{inviteeName}님에게</p>
              <Image alt="" className="size-6 lg:size-[26px]" height={26} src="/icons/email/envelope-open.svg" width={26} />
              <div className="flex flex-col items-center gap-1.5 text-lg font-bold leading-none lg:text-xl">
                <p>{ownerName}님이</p>
                <p>당신에게 부탁을 남겼어요</p>
              </div>
            </header>

            <h2 className="text-base font-bold leading-none lg:text-lg">대체 담당자</h2>

            <div className="flex flex-col items-center gap-2 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
              <p>{ownerName}님이 세상을 떠난 뒤,</p>
              <p>SNS 계정 처리 및 메신저･연락처로</p>
              <p>부고 전달을 대체 담당해 주세요.</p>
            </div>

            <div className="flex flex-col items-center gap-2 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
              <p>먼저 지정된 담당자가 따로 있어요.</p>
              <p>그분이 맡지 못할 때만 요청이 전달돼요.</p>
              <p>연락이 오지 않을 수도 있어요.</p>
            </div>

            <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">그 전까지는 아무 일 없어요.</p>

            <div className="flex flex-col items-center gap-1.5 text-sm font-bold leading-none lg:block lg:text-base lg:font-semibold lg:leading-normal">
              <p>업무 관련 항목만 볼 수 있어요.</p>
              <p>가족･개인 항목은 공개되지 않아요.</p>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] bg-[#eeecee] px-5 py-[18px] lg:gap-3 lg:rounded-[20px]">
              <Image alt="" className="size-5 lg:size-[26px]" height={26} src="/icons/email/lock.svg" width={26} />
              <p className="text-[13px] font-medium leading-none lg:text-base lg:font-semibold">실제 내용은 지금 확인할 수 없어요.</p>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
              <p>지금은 수락 여부만 확인하면 돼요.</p>
              <p>실제 요청은 먼 훗날,</p>
              <p>앞선 담당자가 처리하지 못한 경우</p>
              <p>대기 기간을 거친 뒤에야 전달돼요.</p>
            </div>
          </article>

          <section className="flex flex-col items-center gap-5 pb-3.5 pt-2.5 lg:gap-6 lg:p-0">
            <div className="flex flex-col items-center gap-1.5 text-[13px] font-medium leading-none text-[#796b6c] lg:gap-2 lg:text-[15px]">
              <p>수락 여부를 선택해 주세요</p>
              <p>부담이 된다면 거절해도 괜찮아요</p>
            </div>
            <div className="flex w-full flex-col gap-3.5 lg:gap-[22px]">
              <Button disabled={loading || pending || !invitation} onClick={() => void decide("accept")} type="button">역할 수락하기</Button>
              <RejectButton disabled={loading || pending || !invitation} onClick={() => void decide("decline")} />
            </div>
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

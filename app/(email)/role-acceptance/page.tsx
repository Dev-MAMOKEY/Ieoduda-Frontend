// 역할 담당자 수락 이메일 화면
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";

function SecondaryButton() {
  return <button className="flex min-h-11 w-full items-center justify-center rounded-[14px] bg-[#7f62b8] px-5 py-3.5 text-sm font-medium leading-none text-[#fbfafd] transition-colors hover:bg-[#7055a4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] lg:min-h-12 lg:text-base" type="button">
    거절하기
  </button>;
}

export default function RoleAcceptancePage() {
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex">
      <BrandLogo />
    </header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <header className="mb-3 flex w-full items-center justify-center py-2 lg:hidden">
        <h1 className="text-lg font-bold leading-none">역할 수락</h1>
      </header>
      <h1 className="hidden text-xl font-bold leading-none lg:block">역할 수락</h1>

      <div className="flex w-full flex-col gap-2 lg:mt-[50px] lg:w-[460px] lg:gap-[30px]">
        <article className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-[10px] bg-[#fbfafd] px-5 pb-7 pt-[30px] text-center lg:gap-7 lg:rounded-[30px] lg:pb-[34px] lg:pt-9">
          <header className="flex flex-col items-center gap-3 lg:gap-3.5">
            <p className="text-sm font-bold leading-none text-[#584e4d] lg:text-base">이지수님에게</p>
            <Image alt="" className="size-6 lg:size-[26px]" height={26} src="/icons/email/envelope-open.svg" width={26} />
            <div className="flex flex-col items-center gap-1.5 text-lg font-bold leading-none lg:text-xl">
              <p>김나무님이</p>
              <p>당신에게 부탁을 남겼어요</p>
            </div>
          </header>

          <h2 className="text-base font-bold leading-none lg:text-lg">관계 정리 담당자</h2>

          <div className="flex flex-col items-center gap-2 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
            <p>김나무님이 세상을 떠난 뒤,</p>
            <p>SNS 계정 처리 및 메신저･연락처로</p>
            <p>부고 전달을 담당해 주세요.</p>
            <p className="mt-4 lg:mt-0">그 전까지는 아무 일 없어요.</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-sm font-bold leading-none lg:block lg:text-base lg:font-semibold lg:leading-normal">
            <p>업무 관련 항목만 볼 수 있어요.</p>
            <p>가족·개인 항목은 공개되지 않아요.</p>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] bg-[#eeecee] px-5 py-[18px] lg:gap-3 lg:rounded-[20px]">
            <Image alt="" className="size-5 lg:size-[26px]" height={26} src="/icons/email/lock.svg" width={26} />
            <p className="text-[13px] font-medium leading-none lg:text-base lg:font-semibold">실제 내용은 지금 확인 할 수 없어요.</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-[13px] font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
            <p>지금은 수락 여부만 확인하면 돼요.</p>
            <p>실제 요청은 먼 훗날,</p>
            <p>대기 기간을 거친 뒤에야 전달돼요.</p>
          </div>
        </article>

        <label className="flex w-full flex-col gap-2.5">
          <span className="px-2.5 text-sm font-bold leading-none lg:px-0 lg:text-base">문의 사항</span>
          <input className="min-h-11 w-full rounded-[14px] border-0 bg-[#fbfafd] px-4 py-3.5 text-[13px] font-medium leading-none text-[#584e4d] outline-none placeholder:text-[#a99d9e] focus-visible:ring-2 focus-visible:ring-[#43306d]/25 lg:min-h-12 lg:rounded-[20px] lg:px-5 lg:text-[15px]" placeholder="문의 사항을 작성해 주세요" />
        </label>

        <section className="flex flex-col items-center gap-5 pb-3.5 pt-2.5 lg:gap-6 lg:p-0">
          <div className="flex flex-col items-center gap-1.5 text-[13px] font-medium leading-none text-[#796b6c] lg:gap-2 lg:text-[15px]">
            <p>수락 여부를 선택해 주세요</p>
            <p>부담이 된다면 거절해도 괜찮아요</p>
          </div>
          <div className="flex w-full flex-col gap-3.5 lg:gap-[22px]">
            <Button type="button">역할 수락하기</Button>
            <SecondaryButton />
          </div>
        </section>

        <footer className="flex flex-col items-center gap-2.5 pt-2 text-center text-xs leading-none text-[#796b6c] lg:gap-3 lg:text-sm">
          <p>이 링크는 jisooo@naver.com 으로 발송되었으며, 7일 뒤 만료돼요.</p>
          <p>궁금한 점은 문의해 주세요. <Link className="text-[#584e4d] underline underline-offset-2" href="mailto:support@ieoduda.com">문의하기</Link></p>
        </footer>
      </div>
    </section>
  </main>;
}

import Image from "next/image";
import Link from "next/link";

export default function NewPlanGuidePage() {
  return (
    <main className="min-h-dvh w-full bg-[#f1eff6]">
      <section className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Image
            src="/images/plan-guide-bg.jpeg"
            alt=""
            fill
            priority
            sizes="390px"
            className="object-cover object-top"
          />
        </div>

        <div aria-hidden="true" className="relative h-[59px] shrink-0" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <section className="flex w-full flex-col items-center justify-center gap-[34px] overflow-hidden rounded-[16px] bg-[var(--white)] px-6 pb-[30px] pt-10">
            <div className="flex flex-col items-center gap-5">
              <h1 className="text-[18px] font-bold leading-none text-[var(--purple-1)]">계획 작성 안내</h1>
              <p className="text-center text-[13px] font-medium leading-normal text-[var(--brown-2)]">
                여기 적는 내용은 지금 실행되지 않아요.<br />
                언제든 수정하거나 취소할 수 있어요.
              </p>
            </div>

            <Link
              href="/life-area"
              className="flex h-[45px] w-full items-center justify-center rounded-[14px] bg-[#3c2b62] px-5 text-[14px] font-medium leading-none text-[var(--white)]"
            >
              확인하기
            </Link>
          </section>

          <p className="text-[12px] font-normal leading-none text-[var(--brown-2)]">
            실제 실행은 확인 절차를 모두 거친 뒤에 시작돼요
          </p>
        </div>

        <div aria-hidden="true" className="relative h-[34px] shrink-0" />
      </section>
    </main>
  );
}

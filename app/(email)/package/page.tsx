// 역할별 사후 패키지 화면
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

function ActionButton({ children, href, secondary = false }: { children: string; href?: string; secondary?: boolean }) {
  const className = `flex min-h-11 w-full items-center justify-center rounded-[14px] px-5 py-3.5 text-base font-medium leading-normal text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] lg:min-h-12 ${secondary ? "bg-[#7f62b8] hover:bg-[#7055a4]" : "bg-[#43306d] hover:bg-[#332452] lg:bg-[#3c2b62]"}`;
  return href ? <Link className={className} href={href}>{children}</Link> : <button className={className} type="button">{children}</button>;
}

function TaskItem({ active, description, title }: { active?: boolean; description: string; title: string }) {
  return <div className={`flex min-w-0 flex-1 flex-col items-start gap-2.5 rounded-[14px] px-5 py-[18px] lg:w-full lg:flex-none lg:gap-3.5 lg:rounded-[20px] ${active ? "border-[1.2px] border-[#7f62b8] bg-[#f3f3ff] lg:border-[1.4px]" : "bg-[#eeecee]"}`}>
    <Image alt="" className="size-5 lg:size-[22px]" height={22} src={active ? "/icons/inspection/check-circle.svg" : "/icons/inspection/x-circle.svg"} width={22} />
    <div className="flex flex-col gap-1.5 lg:gap-2">
      <h3 className="text-sm font-bold leading-none lg:text-base">{title}</h3>
      <p className="whitespace-nowrap text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{description}</p>
    </div>
  </div>;
}

function WaitingItem({ description, title }: { description: string; title: string }) {
  return <div className="flex min-w-0 flex-1 flex-col items-start rounded-[14px] bg-[#eeecee] px-5 py-[18px] lg:w-full lg:flex-none lg:rounded-[20px]">
    <div className="flex flex-col gap-1.5 lg:gap-2">
      <h3 className="text-sm font-bold leading-none lg:text-base">{title}</h3>
      <p className="whitespace-nowrap text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{description}</p>
    </div>
  </div>;
}

export default function PackagePage() {
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex"><BrandLogo /></header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <header className="mb-5 flex w-full items-center justify-center py-2 lg:mb-0">
        <h1 className="text-lg font-bold leading-none lg:text-xl">역할 사후 패키지</h1>
      </header>

      <div className="flex w-full flex-col gap-5 lg:mt-[50px] lg:w-[460px] lg:gap-10">
        <section className="flex flex-col gap-5">
          <h2 className="text-center text-base font-bold leading-none lg:text-left lg:text-lg">관계 정리 담당자</h2>

          <div className="flex flex-col gap-3">
            <strong className="text-sm leading-none lg:text-base">1/3 완료</strong>
            <div className="h-2 w-full overflow-hidden rounded-[20px] bg-[#f3f3ff]">
              <div className="h-full w-1/3 rounded-l-[20px] bg-[#43306d]" />
            </div>
          </div>

          <p className="py-2.5 text-center text-xs leading-none text-[#796b6c] lg:text-sm">이 인계는 김나무님이 생전에 이어두다를 통해 공식적으로 설정한 거예요.</p>

          <article className="flex items-center justify-between rounded-[14px] bg-[#fbfafd] px-5 py-[18px]">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold leading-none lg:text-base">SNS 계정 처리</h3>
              <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">비공개로 전환</p>
            </div>
            <span className="rounded-[20px] bg-[#e2dafa] px-2.5 py-1.5 text-xs font-semibold text-[#796b6c]">완료</span>
          </article>

          <article className="flex flex-col gap-[18px] rounded-[16px] border-[1.4px] border-[#7f62b8] bg-[#fbfafd] px-5 pb-[18px] pt-5 lg:gap-4 lg:rounded-[20px] lg:py-[18px]">
            <header className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold leading-none lg:text-base">메신저･연락처로 부고 전달</h3>
              <span className="shrink-0 text-[13px] font-medium leading-none text-[#838383] lg:text-[15px] lg:text-[#796b6c]">진행 중</span>
            </header>
            <div className="flex gap-2.5 lg:flex-col">
              <TaskItem active description="카톡 단체 톡방 전달" title="메신저" />
              <TaskItem description="저장된 모든 번호" title="연락처" />
            </div>
          </article>

          <div className="flex flex-col gap-3.5 pb-3.5 lg:gap-5 lg:py-5">
            <ActionButton>완료하기</ActionButton>
            <ActionButton href="/backup" secondary>문제 신고하기</ActionButton>
          </div>

          <article className="flex flex-col gap-[18px] rounded-[16px] bg-[#fbfafd] px-5 pb-[18px] pt-5 lg:gap-4 lg:rounded-[20px] lg:py-[18px]">
            <header className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold leading-none lg:text-base">부가 계정･구독 처리</h3>
              <span className="shrink-0 text-[13px] font-medium leading-none text-[#838383] lg:text-[15px] lg:text-[#796b6c]">대기</span>
            </header>
            <div className="flex gap-2.5 lg:flex-col">
              <WaitingItem description="커뮤니티･카페 탈퇴" title="부가 계정" />
              <WaitingItem description="OTT 구독 해지" title="구독 처리" />
            </div>
          </article>
        </section>
      </div>
    </section>
  </main>;
}

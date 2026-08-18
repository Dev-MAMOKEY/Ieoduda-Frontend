// 단계별 대체 담당자 화면
import Image from "next/image";
import { BrandLogo } from "@/components/BrandLogo";
import { PageHeader } from "@/components/PageHeader";

function ActionButton({ children, secondary = false }: { children: string; secondary?: boolean }) {
  return <button className={`flex min-h-11 w-full items-center justify-center rounded-[14px] px-5 py-3.5 text-sm font-medium leading-normal text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] lg:min-h-12 lg:text-base ${secondary ? "bg-[#7f62b8] hover:bg-[#7055a4]" : "bg-[#43306d] hover:bg-[#332452] lg:bg-[#3c2b62]"}`} type="button">{children}</button>;
}

function PersonCard({ backup = false }: { backup?: boolean }) {
  return <article className="flex w-full flex-col gap-[18px] rounded-[16px] bg-[#fbfafd] px-5 pb-[18px] pt-5 lg:rounded-[20px] lg:py-[18px]">
    <header className="flex items-start justify-between">
      <div className="flex flex-col gap-3 lg:gap-2">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold leading-none lg:text-base">{backup ? "대체 담당자" : "관계 정리 담당자"}</h2>
          <strong className="text-sm font-semibold leading-none text-[#584e4d] lg:text-[17px]">{backup ? "나신한" : "이지수"}</strong>
        </div>
        <p className="text-xs font-medium leading-none text-[#796b6c] lg:text-sm">{backup ? "아직 연락하지 않았어요" : "이메일은 정상적으로 전달 되었어요"}</p>
      </div>
      <span className="text-[13px] font-medium leading-none text-[#796b6c] lg:text-[15px] lg:text-[#838383]">{backup ? "대기" : "무응답"}</span>
    </header>

    {!backup && <div className="flex w-full flex-col items-center gap-1.5 rounded-[14px] bg-[#f3f3ff] px-5 py-[18px] lg:gap-2 lg:rounded-[20px]">
      <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">대체 담당자에게 넘어가기까지</p>
      <strong className="text-sm leading-none lg:text-base">남은시간 2일 9시간</strong>
    </div>}
  </article>;
}

export default function BackupPage() {
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex"><BrandLogo /></header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <PageHeader
        backHref="/package"
        backLabel="역할 사후 패키지로 돌아가기"
        className="mb-5 py-2 lg:mb-0 lg:w-[460px] lg:py-0"
        title="단계별 대체 담당자"
      />

      <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-10">
        <section className="flex flex-col gap-[22px]">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold leading-none text-[#584e4d] lg:text-base lg:font-medium">현재 단계</p>
            <h2 className="text-base font-bold leading-none lg:text-lg">메신저･연락처로 부고 전달</h2>
          </div>

          <article className="rounded-[14px] bg-[#fbfafd] px-5 py-[18px]">
            <h3 className="text-sm font-bold leading-none lg:text-base">완료 조건</h3>
            <p className="mt-2 text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">카톡 단체 방에 부고 메세지가 전달되면 완료돼요</p>
          </article>

          <PersonCard />

          <div className="flex flex-col gap-3.5 pb-3.5 lg:gap-5 lg:py-5">
            <ActionButton>완료하기</ActionButton>
            <ActionButton secondary>문제 신고하기</ActionButton>
          </div>
        </section>

        <section className="flex flex-col gap-3 lg:gap-[22px]">
          <p className="text-center text-xs leading-none text-[#796b6c] lg:text-sm">시간이 지나면 대체 담당자에게 자동 이관돼요.</p>
          <PersonCard backup />
          <div className="flex items-center justify-center gap-2 py-2.5">
            <Image alt="" className="size-[18px]" height={18} src="/icons/email/lock.svg" width={18} />
            <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">다음 단계는 이 단계가 끝나야 열려요.</p>
          </div>
        </section>
      </div>
    </section>
  </main>;
}

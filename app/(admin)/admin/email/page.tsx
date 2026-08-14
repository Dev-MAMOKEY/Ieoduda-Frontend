import Image from "next/image";
import Link from "next/link";
import { AdminAuditTabs } from "@/components/AdminAuditTabs";
import { getEmailAudit } from "@/lib/api";

type EmailRecipient = ReturnType<typeof getEmailAudit>["recipients"][number];
const button =
  "h-[45px] rounded-[20px] border-0 bg-[#a8a8a8] text-sm text-white transition-all duration-200 hover:bg-[#929292] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383] active:scale-[0.985] lg:h-[47px] lg:rounded-[30px] lg:text-[15px]";
function Recipient({ person }: { person: EmailRecipient }) {
  return (
    <article className="flex flex-col gap-[22px] rounded-[20px] bg-white p-5">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2.5">
          <strong className="text-sm lg:text-base">{person.role}</strong>
          <span className="flex gap-2 text-sm text-[#838383]">
            <span>{person.name}</span>
            <span>{person.email}</span>
          </span>
        </div>
        <span className="flex items-center gap-1.5 self-start text-[13px] text-[#838383] lg:text-[15px]">
          {person.status}
          {person.warning && (
            <Image
              alt=""
              width={20}
              height={20}
              src="/icons/plan/cards/warning.svg"
            />
          )}
        </span>
      </div>
      <div className="flex justify-between gap-3">
        {person.events.map((event) => (
          <div className="flex gap-2 text-xs lg:text-sm" key={event[0]}>
            <strong>{event[0]}</strong>
            <span className="text-[#838383]">{event[1]}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
export default function EmailPage() {
  const audit = getEmailAudit();
  return (
    <main className="min-h-dvh bg-[#f0f0f2] px-6 py-[70px] text-[#28292e] lg:px-0 lg:py-0">
      <header className="hidden h-[125px] grid-cols-3 items-center px-[50px] lg:grid">
        <Link className="p-2 text-[22px] font-semibold" href="/">
          이어두다
        </Link>
        <AdminAuditTabs active="email" desktop />
        <span />
      </header>
      <div className="mx-auto flex max-w-[390px] flex-col gap-[22px] lg:max-w-none lg:gap-0">
        <header className="grid grid-cols-[24px_1fr_24px] pb-5 lg:flex lg:justify-center lg:pb-0">
          <Link className="lg:hidden" href="/admin/evidence">
            <Image
              alt=""
              className="rotate-180"
              width={24}
              height={24}
              src="/icons/common/caret-right.svg"
            />
          </Link>
          <h1 className="text-center text-lg font-bold lg:text-xl">
            이메일 발송 감사
          </h1>
          <span />
        </header>
        <AdminAuditTabs active="email" />
        <div className="flex flex-col gap-[22px] lg:px-[120px] lg:py-[50px]">
          <div className="flex flex-col gap-3.5 lg:flex-row lg:justify-between">
            <h2 className="text-base font-bold lg:text-lg">
              수신자 총 {audit.totalCount}명
            </h2>
            <div className="flex gap-2.5 text-xs text-[#838383] lg:text-sm">
              {audit.summary.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          {audit.recipients.map((p) => (
            <Recipient key={p.email} person={p} />
          ))}
          <div className="pb-2.5 text-center text-xs text-[#838383] lg:text-sm">
            <p>전달 상태만 조회가 가능해요.</p>
            <p className="mt-1.5">
              이메일 본문·패키지 내용에는 접근할 수 없어요.
            </p>
          </div>
          <button className={button} type="button">
            재시도 정책 실행하기
          </button>
          <div className="grid grid-cols-2 gap-3.5">
            <button className={button} type="button">
              사건 동결하기
            </button>
            <button className={button} type="button">
              파트너 문의하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

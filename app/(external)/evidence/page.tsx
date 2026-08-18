import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

type EvidenceItem = {
  id: string;
  submittedAt: string;
  title: string;
  submitter: string;
  verified: boolean;
};

type EvidenceGroup = {
  name: string;
  verifiedCount: number;
  items: EvidenceItem[];
};

const groups: EvidenceGroup[] = [
  {
    name: "김나무",
    verifiedCount: 2,
    items: [
      { id: "death-certificate-kim", submittedAt: "26.05.11 PM 11:50", title: "사망 진단서", submitter: "유지민 제출", verified: true },
      { id: "medical-examination-kim", submittedAt: "26.05.11 AM 12:30", title: "검안서", submitter: "박성호 제출", verified: true },
    ],
  },
  {
    name: "이신한",
    verifiedCount: 1,
    items: [
      { id: "death-report-lee", submittedAt: "26.12.01 AM 14:00", title: "사망 신고서", submitter: "김하나 제출", verified: true },
      { id: "death-certificate-lee", submittedAt: "26.12.03 PM 09:55", title: "사망 진단서", submitter: "이재현 제출", verified: false },
    ],
  },
];

function StatusBadge({ verified }: { verified: boolean }) {
  return <span className={`flex min-h-[28px] shrink-0 items-center justify-center rounded-[20px] px-2.5 py-1.5 text-xs font-semibold text-[#796b6c] ${verified ? "bg-[#e2dafa]" : "bg-[#eeecee]"}`}>
    {verified ? "검증완료" : "검증필요"}
  </span>;
}

function EvidenceCard({ item }: { item: EvidenceItem }) {
  return <Link aria-label={`${item.title} 검토하기`} className="flex w-full items-center justify-between rounded-[20px] bg-[#fbfafd] px-5 py-[18px] transition-shadow hover:shadow-[0_4px_16px_rgba(67,48,109,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d]" href={`/external?doc=${item.id}`}>
    <div className="flex flex-col gap-2 leading-none lg:gap-2.5">
      <div className="flex flex-col gap-1.5 lg:gap-2">
        <time className="text-[13px] font-medium text-[#796b6c] lg:text-[15px]">{item.submittedAt}</time>
        <h3 className="text-sm font-bold text-[#43306d] lg:text-base">{item.title}</h3>
      </div>
      <p className="text-[13px] font-medium text-[#43306d] lg:text-[15px]">{item.submitter}</p>
    </div>
    <StatusBadge verified={item.verified} />
  </Link>;
}

function EvidenceSection({ group, second = false }: { group: EvidenceGroup; second?: boolean }) {
  return <section className={`flex w-full flex-col gap-4 lg:gap-5 ${second ? "pt-3 lg:pt-0" : ""}`}>
    <header className="flex items-center justify-between">
      <h2 className="text-base font-bold leading-none text-[#43306d] lg:text-lg">{group.name}</h2>
      <strong className="text-sm leading-none text-[#796b6c] lg:text-base">{group.verifiedCount}명 검증 완료</strong>
    </header>
    <div className="flex flex-col gap-3 lg:gap-[18px]">
      {group.items.map((item) => <EvidenceCard item={item} key={`${item.submittedAt}-${item.title}`} />)}
    </div>
  </section>;
}

export default function EvidencePage() {
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex">
      <BrandLogo />
    </header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <header className="mb-[22px] flex w-full items-center justify-center py-2 lg:hidden">
        <h1 className="text-lg font-bold leading-none">등록된 증빙 자료</h1>
      </header>
      <h1 className="hidden text-xl font-bold leading-none lg:block">등록된 증빙 자료</h1>

      <div className="flex w-full flex-col gap-4 lg:mt-[50px] lg:w-[460px] lg:gap-10">
        {groups.map((group, index) => <EvidenceSection group={group} key={group.name} second={index > 0} />)}
      </div>
    </section>
  </main>;
}

import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const details = [
  { section: "본인 경고", items: [["이메일", "namu_k@gmail.com"]] },
  {
    section: "부고 전달",
    items: [
      ["이름", "홍길동"],
      ["이메일", "hong_k@naver.com"],
      ["대기 기간", "14일"],
    ],
  },
];
export default function AppealEditPage() {
  return (
    <PageContainer
      className="gap-0 pb-9 pt-[70px] md:min-h-[calc(100dvh-125px)] md:max-w-none md:px-[120px] md:pb-20 md:pt-0"
      data-node-id="525:3186"
    >
      <PageHeader
        backHref="/profile"
        title="대기 이의제기 수정"
      />
      <div className="mx-auto flex w-full max-w-[342px] flex-col gap-5 pt-5 md:max-w-[460px] md:gap-10 md:pt-[50px]">
        <article className="flex flex-col gap-[30px] rounded-[20px] bg-white px-5 pb-5 pt-6 md:pb-[22px] md:pt-[30px]">
          {details.map((group, groupIndex) => (
            <section className={`flex flex-col ${groupIndex === 0 ? "gap-[14px] md:gap-3" : "gap-3"}`} key={group.section}>
              <h2 className={`text-base font-bold md:px-2.5 md:text-lg md:text-[#43306d] ${groupIndex === 1 ? "text-[#28292e]" : "text-[#43306d]"}`}>
                {groupIndex === 1 ? <><span className="md:hidden">이의 제기 연락처</span><span className="hidden md:inline">{group.section}</span></> : group.section}
              </h2>
              {group.items.map(([label, value]) => (
                <div className="rounded-[14px] bg-[#eeecee] px-5 py-[18px] md:rounded-[20px] md:p-5" key={label}>
                  <h3 className="text-sm font-bold text-[#43306d] md:text-base">{label}</h3>
                  <p className="mt-2 text-[13px] font-medium text-[#584e4d] md:text-[15px]">
                    {value}
                  </p>
                </div>
              ))}
            </section>
          ))}
        </article>
        <Button href="/appeal">
          수정하기
        </Button>
      </div>
    </PageContainer>
  );
}

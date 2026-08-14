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
      className="gap-[22px] py-[70px] lg:max-w-none lg:gap-10 lg:px-[120px] lg:pb-[50px] lg:pt-0"
      data-node-id="525:3186"
    >
      <PageHeader
        backHref="/profile"
        className="pb-5 lg:pb-0"
        title="대기 이의제기 수정"
      />
      <div className="flex flex-col gap-10">
        <article className="flex flex-col gap-[30px] rounded-[20px] bg-white px-5 pb-[22px] pt-[30px]">
          {details.map((group) => (
            <section className="flex flex-col gap-3" key={group.section}>
              <h2 className="px-2.5 text-base font-bold">{group.section}</h2>
              {group.items.map(([label, value]) => (
                <div className="rounded-[20px] bg-[#f0f0f2] p-5" key={label}>
                  <h3 className="text-sm font-bold">{label}</h3>
                  <p className="mt-2 text-sm font-medium text-[#838383]">
                    {value}
                  </p>
                </div>
              ))}
            </section>
          ))}
        </article>
        <Button className="lg:h-[52px]" href="/appeal">
          수정하기
        </Button>
      </div>
    </PageContainer>
  );
}

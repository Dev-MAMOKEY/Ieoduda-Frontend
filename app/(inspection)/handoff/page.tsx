import Image from "next/image";
import { BottomTabBar } from "@/components/BottomTabBar";
import { InspectionNavigation } from "@/components/InspectionNavigation";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getHandoffInspectionPeople } from "@/lib/api";

type HandoffPerson = ReturnType<typeof getHandoffInspectionPeople>[number];
type StatusItem = HandoffPerson["checks"][number];

function StatusBox({ item, wide }: { item: StatusItem; wide: boolean }) {
  return (
    <div className={`flex min-h-[72px] flex-1 items-center justify-between rounded-[20px] bg-[#f0f0f2] px-5 py-[18px] ${wide ? "col-span-2" : ""}`}>
      <div className="flex flex-col gap-1.5">
        <strong className="text-xs lg:text-sm">{item[0]}</strong>
        <span className="text-xs font-medium text-[#838383] lg:text-sm">{item[1]}</span>
      </div>
      <Image alt="" className="size-5" height={20} src={item[2] ? "/icons/inspection/check-circle.svg" : "/icons/inspection/x-circle.svg"} width={20} />
    </div>
  );
}

function HandoffCard({ person }: { person: HandoffPerson }) {
  return (
    <article className="flex min-w-0 flex-1 flex-col gap-6 rounded-[20px] bg-white p-5">
      <div className="flex justify-between">
        <h3 className="text-base font-bold lg:text-lg">{person.name}</h3>
        <span className="text-xs font-medium text-[#838383] lg:text-sm">{person.ready}</span>
      </div>
      <section className="flex flex-col gap-3">
        <h4 className="text-sm font-bold lg:text-base">{person.role}</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {person.checks.map((item) => (
            <StatusBox item={item} key={String(item[0])} wide={item[0] === "대체 담당자"} />
          ))}
        </div>
      </section>
      <div className="flex min-h-[72px] flex-col justify-center gap-1.5 rounded-[20px] bg-[#f0f0f2] px-5 py-[18px]">
        <strong className="text-xs lg:text-sm">문의 사항</strong>
        <p className="whitespace-pre-line text-xs font-medium text-[#838383] lg:text-sm">{person.question}</p>
      </div>
    </article>
  );
}

function HandoffGroup({ type }: { type: "담당자" | "확인자" }) {
  const members = getHandoffInspectionPeople().filter((person) => person.type === type);
  return (
    <section className="flex flex-col gap-[22px]">
      <div className="flex justify-between">
        <h2 className="text-base font-bold lg:text-lg">{type} 총 {members.length}명</h2>
        <span className="text-sm font-medium text-[#838383]">{members.filter((person) => person.complete).length}명 점검 완료</span>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        {members.map((person) => <HandoffCard key={person.name} person={person} />)}
      </div>
    </section>
  );
}

export default function HandoffInspectionPage() {
  return (
    <PageContainer className="role-preview gap-[22px] pb-[100px] pt-[70px] md:max-w-none md:gap-[30px] md:px-[120px] md:pb-[50px] md:pt-0">
      <PageHeader className="pb-1.5 md:pb-0" title="인계 점검" />
      <InspectionNavigation active="handoff" />
      <div className="flex flex-col gap-10">
        <HandoffGroup type="담당자" />
        <HandoffGroup type="확인자" />
      </div>
      <BottomTabBar activeTab="inspection" />
    </PageContainer>
  );
}

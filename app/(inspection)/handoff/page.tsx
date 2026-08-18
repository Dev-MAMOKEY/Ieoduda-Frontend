 "use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BottomTabBar } from "@/components/BottomTabBar";
import { InspectionNavigation } from "@/components/InspectionNavigation";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getHandoffInspectionPeople } from "@/lib/api";

type HandoffPerson = Awaited<ReturnType<typeof getHandoffInspectionPeople>>[number];
type StatusItem = HandoffPerson["checks"][number];

function StatusBox({ item, wide }: { item: StatusItem; wide: boolean }) {
  return (
    <div className={`flex min-h-[72px] flex-1 items-center justify-between rounded-[14px] bg-[#eeecee] px-5 py-[18px] ${wide ? "col-span-2" : ""}`}>
      <div className="flex flex-col gap-1.5">
        <strong className="text-sm text-[#43306d] lg:text-base">{item[0]}</strong>
        <span className="text-[13px] font-medium text-[#584e4d]">{item[1]}</span>
      </div>
      <Image alt="" className="size-5 lg:size-[22px]" height={22} src={item[2] ? "/icons/inspection/check-circle.svg" : "/icons/inspection/x-circle.svg"} width={22} />
    </div>
  );
}

function HandoffCard({ person }: { person: HandoffPerson }) {
  return (
    <article className="flex min-w-0 flex-1 flex-col gap-6 rounded-[18px] bg-white px-5 pb-5 pt-6 lg:gap-7 lg:rounded-[20px] lg:pt-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold text-[#43306d] lg:text-xl">{person.name}</h3>
        <span className="text-sm font-bold text-[#584e4d] lg:text-base lg:text-[#796b6c]">{person.ready}</span>
      </div>
      <section className="flex flex-col gap-3 lg:gap-4">
        <h4 className="text-sm font-bold text-[#43306d] lg:text-base">{person.role}</h4>
        <div className="grid grid-cols-2 gap-x-3 gap-y-[14px] lg:gap-2.5">
          {person.checks.map((item) => (
            <StatusBox item={item} key={String(item[0])} wide={item[0] === "대체 담당자"} />
          ))}
        </div>
        <div className="mt-0.5 flex min-h-[72px] flex-col justify-center gap-2 rounded-[14px] bg-[#f3f3ff] px-5 py-[18px] lg:mt-0 lg:gap-1.5">
          <strong className="text-sm text-[#43306d] lg:text-base">문의 사항</strong>
          <p className="whitespace-pre-line break-words text-[13px] font-medium text-[#584e4d]">{person.question}</p>
        </div>
      </section>
    </article>
  );
}

function HandoffGroup({ people, type }: { people: HandoffPerson[]; type: "담당자" | "확인자" }) {
  const members = people.filter((person) => person.type === type);
  return (
    <section className="flex flex-col gap-[22px] lg:gap-6">
      <div className="flex justify-between">
        <h2 className="text-base font-bold text-[#43306d] lg:text-lg">{type} 총 {members.length}명</h2>
        <span className="text-sm font-bold text-[#796b6c] lg:text-[#584e4d]">{members.filter((person) => person.complete).length}명 점검 완료</span>
      </div>
      <div className="flex flex-col gap-[14px] lg:gap-5">
        {members.map((person) => <HandoffCard key={person.name} person={person} />)}
      </div>
    </section>
  );
}

export default function HandoffInspectionPage() {
  const [people, setPeople] = useState<HandoffPerson[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    getHandoffInspectionPeople()
      .then(setPeople)
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : "인계 점검 정보를 불러오지 못했습니다."));
  }, []);
  return (
    <PageContainer className="role-preview gap-0 pb-[100px] pt-[70px] lg:min-h-[calc(100dvh-125px)] lg:max-w-none lg:px-[120px] lg:pb-20 lg:pt-0">
      <PageHeader
        className="pb-1.5 md:pb-0"
        title="인계 점검"
      />
      <div className="mx-auto flex w-full flex-col gap-3 pt-[16px] lg:max-w-[460px] lg:gap-10 lg:pt-[30px]">
        <InspectionNavigation active="handoff" />
        <div className="flex flex-col gap-[26px] lg:gap-[60px]">
          {errorMessage && <p className="text-center text-sm text-red-700" role="alert">{errorMessage}</p>}
          {!errorMessage && people.length === 0 && <p className="text-center text-sm text-[#796b6c]">인계 점검 정보를 불러오는 중입니다.</p>}
          <HandoffGroup people={people} type="담당자" />
          <HandoffGroup people={people} type="확인자" />
        </div>
      </div>
      <BottomTabBar activeTab="inspection" />
    </PageContainer>
  );
}

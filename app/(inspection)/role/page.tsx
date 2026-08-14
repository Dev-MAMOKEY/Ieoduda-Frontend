"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Button } from "@/components/Button";
import { InspectionNavigation } from "@/components/InspectionNavigation";
import { OutlineButton } from "@/components/OutlineButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getRoleInspectionPeople } from "@/lib/api";

function RoleContent() {
  const people = getRoleInspectionPeople();
  const requested = useSearchParams().get("person");
  const [selectedId, setSelectedId] = useState(
    people.some((person) => person.id === requested) ? requested : people[0].id,
  );
  const person = people.find((item) => item.id === selectedId) ?? people[0];
  const verifier = person.type === "verifier";

  return (
    <PageContainer className="role-preview gap-[22px] pb-[100px] pt-[70px] md:max-w-none md:gap-[30px] md:px-[120px] md:pb-[50px] md:pt-0">
      <PageHeader className="pb-1.5 md:pb-0" title="역할 점검" />
      <InspectionNavigation active="role" />
      <section className="flex flex-col gap-10">
        <div className="flex justify-between px-1">
          {people.map((item) => (
            <button
              className={`rounded-[30px] bg-white px-4 py-3 text-sm md:px-5 md:text-base ${item.id === person.id ? "border-[1.6px] border-[#838383] font-semibold text-[#838383]" : "border-0 text-[#a8a8a8]"}`}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
        <article className="flex flex-col gap-[30px] rounded-[20px] bg-white px-5 pb-[22px] pt-[30px] md:px-[30px]">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold lg:text-xl">{person.name}님</h2>
              <span className="text-sm font-medium text-[#838383] lg:text-base">{person.status}</span>
            </div>
            <p className="text-sm font-medium text-[#838383] lg:text-base">{person.email}</p>
          </div>
          <section className="flex flex-col gap-2.5">
            <h3 className="text-base font-bold lg:text-lg">{person.role}</h3>
            <p className="text-sm font-medium text-[#838383] lg:text-base">{person.summary}</p>
          </section>
          {!verifier && (
            <section className="flex flex-col gap-2.5">
              <h3 className="text-base font-bold lg:text-lg">대기 기간</h3>
              <p className="text-sm font-medium text-[#838383] lg:text-base">{person.waitingPeriod}</p>
            </section>
          )}
          {verifier ? (
            <div className="rounded-[20px] bg-[#f0f0f2] px-5 py-[18px]">
              <strong className="text-sm">사망 확인 날짜</strong>
              <p className="mt-2.5 text-[13px] font-medium text-[#838383]">사용자의 사망이 확인되고 날짜가 등록되면 확인 가능해요</p>
            </div>
          ) : (
            person.groups?.map((group) => (
              <section className="flex flex-col gap-3" key={group.title}>
                <h3 className="px-2.5 text-base font-bold">{group.title}</h3>
                {group.tasks.map(([title, description]) => (
                  <div className="rounded-[20px] bg-[#f0f0f2] p-5" key={title}>
                    <strong className="text-sm">{title}</strong>
                    <p className="mt-2 text-sm font-medium text-[#838383]">{description}</p>
                  </div>
                ))}
              </section>
            ))
          )}
        </article>
      </section>
      <div className="flex flex-col gap-[22px] md:gap-[30px]">
        <Button className="md:h-[52px]" type="button">수락 요청 다시 보내기</Button>
        <OutlineButton className="md:h-[52px] md:text-base" href={verifier ? "/role/verifier/edit" : "/role/manager/edit"}>
          {verifier ? "확인자 수정하기" : "담당자 수정하기"}
        </OutlineButton>
      </div>
      <BottomTabBar activeTab="inspection" />
    </PageContainer>
  );
}

export default function RoleInspectionPage() {
  return <Suspense fallback={null}><RoleContent /></Suspense>;
}

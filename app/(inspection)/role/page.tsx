"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BottomTabBar } from "@/components/BottomTabBar";
import { Button } from "@/components/Button";
import { InspectionNavigation } from "@/components/InspectionNavigation";
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
    <PageContainer className="role-preview gap-3 pb-[100px] pt-[70px] lg:max-w-none lg:px-[120px] lg:pb-20 lg:pt-0">
      <PageHeader className="items-center px-1 py-2 md:px-0 md:py-0" title="역할 점검" />
      <div className="mx-auto flex w-full max-w-[342px] flex-col gap-[30px] pt-1 md:max-w-[460px] md:pt-[18px]">
        <InspectionNavigation active="role" />
        <section className="flex flex-col gap-10 pb-5">
        <div className="flex items-center justify-between px-1">
          {people.map((item) => (
            <button
              className={`rounded-[16px] px-[18px] py-3 text-[13px] font-medium transition-colors md:text-[15px] ${item.id === person.id ? "border-[1.4px] border-[#43306d] bg-[#e2dafa] text-[#43306d]" : "border-[1.4px] border-transparent bg-[#f3f3ff] text-[#a99d9e]"}`}
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
        <article className="flex flex-col gap-[30px] rounded-[20px] bg-white px-5 pb-[22px] pt-[30px] md:px-[26px]">
          <div className="flex flex-col gap-3 text-[#43306d]">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold md:text-xl">{person.name}님</h2>
              <span className="text-sm font-bold text-[#796b6c] md:text-base">{person.status}</span>
            </div>
            <p className="text-sm font-medium text-[#796b6c] md:text-[15px]">{person.email}</p>
          </div>
          <div className={verifier ? "flex flex-col gap-5" : "grid grid-cols-2 items-start pb-1.5"}>
            <section className={`flex min-w-0 flex-col gap-2.5 ${verifier ? "" : "pr-[18px] md:pr-[30px]"}`}>
              <h3 className="text-sm font-bold text-[#43306d] md:text-base">{person.role}</h3>
              <p className="text-[13px] font-medium text-[#796b6c] md:text-[15px]">{person.summary}</p>
            </section>
            {!verifier && (
              <section className="flex shrink-0 flex-col justify-center gap-2.5 border-l-[1.4px] border-[#e2dafa] pl-[18px] md:pl-[30px]">
                <h3 className="text-sm font-bold text-[#43306d] md:text-base">대기 기간</h3>
                <p className="text-[13px] font-medium text-[#796b6c] md:text-[15px]">{person.waitingPeriod}</p>
              </section>
            )}
          </div>
          {verifier ? (
            <div className="rounded-[20px] bg-[#eeecee] p-5">
              <strong className="text-sm text-[#43306d] md:text-base">사망 확인 날짜</strong>
              <p className="mt-2.5 text-[13px] font-medium text-[#584e4d] lg:hidden">사용자의 사망 날짜가 확인되면 볼 수 있어요</p>
              <p className="mt-2.5 hidden text-[15px] font-medium text-[#584e4d] lg:block">사용자의 사망이 확인되고 날짜가 등록되면 확인 가능해요</p>
            </div>
          ) : (
            person.groups?.map((group) => (
              <section className="flex flex-col gap-4" key={group.title}>
                <h3 className="px-2.5 text-sm font-bold text-[#43306d] md:text-base">{group.title}</h3>
                {group.tasks.map(([title, description]) => (
                  <div className="rounded-[20px] bg-[#eeecee] p-5" key={title}>
                    <strong className="text-sm text-[#43306d] md:text-base">{title}</strong>
                    <p className="mt-2 text-[13px] font-medium text-[#584e4d] md:text-[15px]">{description}</p>
                  </div>
                ))}
              </section>
            ))
          )}
        </article>
      </section>
        <div className="flex flex-col gap-[26px]">
          <Button type="button">수락 요청 다시 보내기</Button>
          <Button className="bg-[#7f62b8] hover:!bg-[#6f54a5]" href={verifier ? "/role/verifier/edit" : "/role/manager/edit"}>
            {verifier ? "확인자 수정하기" : "담당자 수정하기"}
          </Button>
        </div>
      </div>
      <BottomTabBar activeTab="inspection" />
    </PageContainer>
  );
}

export default function RoleInspectionPage() {
  return <Suspense fallback={null}><RoleContent /></Suspense>;
}

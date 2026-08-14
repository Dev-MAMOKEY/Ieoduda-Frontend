"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { OutlineButton } from "@/components/OutlineButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { BottomTabBar } from "@/components/BottomTabBar";

const people = [
  {
    id: "jisu",
    name: "이지수",
    email: "jisooo@naver.com",
    status: "수락 대기",
    type: "manager",
    role: "관계 정리",
    summary: "SNS 계정 / 부고 전달",
    waitingPeriod: "7일",
    groups: [
      {
        title: "SNS 계정",
        tasks: [
          ["인스타그램", "비공개 처리"],
          ["트위터", "계정 삭제"],
        ],
      },
      {
        title: "부고 전달",
        tasks: [
          ["문자 메시지", "연락처에 저장된 모든 전화번호"],
          ["카카오톡", "단체 톡방"],
        ],
      },
    ],
  },
  {
    id: "minsu",
    name: "김민수",
    email: "minsu.kim@gmail.com",
    status: "수락 완료",
    type: "manager",
    role: "업무 정리",
    summary: "디자인 프로젝트 인수인계",
    waitingPeriod: "7일",
    groups: [
      {
        title: "작업 파일",
        tasks: [
          ["피그마", "디자인 파일 소유권 이전"],
          ["구글 드라이브", "프로젝트 폴더 공유"],
        ],
      },
    ],
  },
  {
    id: "jimin",
    name: "유지민",
    email: "jimin_u@gmail.com",
    status: "수락 대기",
    type: "verifier",
    role: "확인자",
    summary: "사용자 사망 확인 / 날짜 전달",
  },
  {
    id: "sungho",
    name: "박성호",
    email: "sungho.park@gmail.com",
    status: "수락 완료",
    type: "verifier",
    role: "확인자",
    summary: "사용자 사망 확인 / 날짜 전달",
  },
];

const handoff = [
  {
    name: "이지수",
    type: "담당자",
    ready: "준비 완료",
    role: "관계 정리",
    complete: true,
    checks: [
      ["이메일", "도달 완료", true],
      ["수락", "수락 완료", true],
      ["대체 담당자", "없음", true],
    ],
    question: "없음",
  },
  {
    name: "김민수",
    type: "담당자",
    ready: "준비 대기",
    role: "업무 정리",
    complete: false,
    checks: [
      ["이메일", "도달 완료", true],
      ["수락", "수락 대기", false],
      ["대체 담당자", "없음", false],
    ],
    question:
      "말씀하신 디자인 프로젝트 저 혼자 인계받는 건가요?\n팀에 같이 넘겨야 할 사람이 있으면 미리 알아두고 싶어요.",
  },
  {
    name: "유지민",
    type: "확인자",
    ready: "준비 대기",
    role: "관계 정리",
    complete: true,
    checks: [
      ["이메일", "도달 완료", true],
      ["역할", "수락 완료", true],
    ],
    question: "없음",
  },
  {
    name: "박성호",
    type: "확인자",
    ready: "준비 완료",
    role: "관계 정리",
    complete: true,
    checks: [
      ["이메일", "도달 완료", true],
      ["역할", "수락 완료", true],
    ],
    question: "없음",
  },
];

type StatusItem = (string | boolean)[];
type HandoffPerson = (typeof handoff)[number];

function StatusBox({ item, wide = false }: { item: StatusItem; wide?: boolean }) {
  return (
    <div
      className={`flex min-h-[72px] flex-1 items-center justify-between rounded-[20px] bg-[#f0f0f2] px-5 py-[18px] ${wide ? "col-span-2" : ""}`}
    >
      <div className="flex flex-col gap-1.5">
        <strong className="text-xs lg:text-sm">{item[0]}</strong>
        <span className="text-xs font-medium text-[#838383] lg:text-sm">
          {item[1]}
        </span>
      </div>
      <Image
        alt=""
        className="size-5"
        width={20}
        height={20}
        src={
          item[2]
            ? "/icons/inspection/check-circle.svg"
            : "/icons/inspection/x-circle.svg"
        }
      />
    </div>
  );
}

function HandoffCard({ person }: { person: HandoffPerson }) {
  return (
    <article className="flex min-w-0 flex-1 flex-col gap-6 rounded-[20px] bg-white p-5">
      <div className="flex justify-between">
        <h3 className="text-base font-bold lg:text-lg">{person.name}</h3>
        <span className="text-xs font-medium text-[#838383] lg:text-sm">
          {person.ready}
        </span>
      </div>
      <section className="flex flex-col gap-3">
        <h4 className="text-sm font-bold lg:text-base">{person.role}</h4>
        <div className="grid grid-cols-2 gap-2.5">
          {person.checks.map((item, index) => (
            <StatusBox
              key={String(item[0])}
              item={item}
              wide={
                item[0] === "대체 담당자" ||
                (person.type === "확인자" && index === 2)
              }
            />
          ))}
        </div>
      </section>
      <div className="flex min-h-[72px] flex-col justify-center gap-1.5 rounded-[20px] bg-[#f0f0f2] px-5 py-[18px]">
        <strong className="text-xs lg:text-sm">문의 사항</strong>
        <p className="whitespace-pre-line text-xs font-medium text-[#838383] lg:text-sm">
          {person.question}
        </p>
      </div>
    </article>
  );
}

function HandoffGroup({ type }: { type: string }) {
  const members = handoff.filter((person) => person.type === type);
  return (
    <section className="flex flex-col gap-[22px]">
      <div className="flex justify-between">
        <h2 className="text-base font-bold lg:text-lg">
          {type} 총 {members.length}명
        </h2>
        <span className="text-sm font-medium text-[#838383]">
          {members.filter((p) => p.complete).length}명 점검 완료
        </span>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        {members.map((person) => (
          <HandoffCard key={person.name} person={person} />
        ))}
      </div>
    </section>
  );
}

function RoleContent() {
  const params = useSearchParams();
  const requested = params.get("person");
  const [tab, setTab] = useState("role");
  const [selectedId, setSelectedId] = useState(
    people.some((p) => p.id === requested) ? requested : "jisu",
  );
  const person = people.find((p) => p.id === selectedId) ?? people[0];
  const verifier = person.type === "verifier";

  return (
    <PageContainer className="role-preview gap-[22px] pb-[100px] pt-[70px] md:max-w-none md:gap-[30px] md:px-[120px] md:pb-[50px] md:pt-0">
      <PageHeader
        title={tab === "role" ? "역할 점검" : "인계 점검"}
        className="pb-1.5 md:pb-0"
      />
      <nav aria-label="점검 종류" className="flex gap-[30px] md:gap-9">
        {[
          ["role", "역할 점검"],
          ["handoff", "인계 점검"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`border-0 bg-transparent pb-1 text-base font-bold md:text-lg ${tab === id ? "border-b-[1.2px] border-[#28292e]" : "text-[#a8a8a8]"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      {tab === "role" ? (
        <>
          <section className="flex flex-col gap-10">
            <div className="flex justify-between px-1">
              {people.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`rounded-[30px] bg-white px-4 py-3 text-sm md:px-5 md:text-base ${p.id === person.id ? "border-[1.6px] border-[#838383] font-semibold text-[#838383]" : "border-0 text-[#a8a8a8]"}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <article className="flex flex-col gap-[30px] rounded-[20px] bg-white px-5 pb-[22px] pt-[30px] md:px-[30px]">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold lg:text-xl">
                    {person.name}님
                  </h2>
                  <span className="text-sm font-medium text-[#838383] lg:text-base">
                    {person.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#838383] lg:text-base">
                  {person.email}
                </p>
              </div>
              <section className="flex flex-col gap-2.5">
                <h3 className="text-base font-bold lg:text-lg">
                  {person.role}
                </h3>
                <p className="text-sm font-medium text-[#838383] lg:text-base">
                  {person.summary}
                </p>
              </section>
              {!verifier && (
                <section className="flex flex-col gap-2.5">
                  <h3 className="text-base font-bold lg:text-lg">대기 기간</h3>
                  <p className="text-sm font-medium text-[#838383] lg:text-base">
                    {person.waitingPeriod}
                  </p>
                </section>
              )}
              {verifier ? (
                <div className="rounded-[20px] bg-[#f0f0f2] px-5 py-[18px]">
                  <strong className="text-sm">사망 확인 날짜</strong>
                  <p className="mt-2.5 text-[13px] font-medium text-[#838383]">
                    사용자의 사망이 확인되고 날짜가 등록되면 확인 가능해요
                  </p>
                </div>
              ) : (
                person.groups!.map((group) => (
                  <section className="flex flex-col gap-3" key={group.title}>
                    <h3 className="px-2.5 text-base font-bold">
                      {group.title}
                    </h3>
                    {group.tasks.map(([title, desc]) => (
                      <div
                        key={title}
                        className="rounded-[20px] bg-[#f0f0f2] p-5"
                      >
                        <strong className="text-sm">{title}</strong>
                        <p className="mt-2 text-sm font-medium text-[#838383]">
                          {desc}
                        </p>
                      </div>
                    ))}
                  </section>
                ))
              )}
            </article>
          </section>
          <div className="flex flex-col gap-[22px] md:gap-[30px]">
            <Button className="md:h-[52px]" type="button">
              수락 요청 다시 보내기
            </Button>
            <OutlineButton
              className="md:h-[52px] md:text-base"
              href={verifier ? "/role/verifier/edit" : "/role/manager/edit"}
            >
              {verifier ? "확인자 수정하기" : "담당자 수정하기"}
            </OutlineButton>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-10">
          <HandoffGroup type="담당자" />
          <HandoffGroup type="확인자" />
        </div>
      )}
      <BottomTabBar activeTab="inspection" />
    </PageContainer>
  );
}

export default function RoleInspectionPage() {
  return (
    <Suspense fallback={null}>
      <RoleContent />
    </Suspense>
  );
}

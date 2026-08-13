"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/Button";
import { OutlineButton } from "@/components/OutlineButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const people = [
  {
    id: "jisu",
    name: "이지수",
    email: "jisu2@naver.com",
    status: "수락 대기",
    participantType: "역할담당자",
    role: "관계 정리",
    summary: "SNS 계정 /부고 전달",
    waitingPeriod: "14일",
    taskGroups: [
      {
        title: "SNS 계정",
        tasks: [
          { title: "인스타그램", description: "비공개 처리" },
          { title: "트위터", description: "계정 삭제" },
        ],
      },
      {
        title: "부고 전달",
        tasks: [
          { title: "문자 메시지", description: "연락처에 저장 된 모든 전화번호" },
          { title: "카카오톡", description: "단체 톡방" },
        ],
      },
    ],
  },
  {
    id: "minsu",
    name: "김민수",
    email: "minsu.kim@gmail.com",
    status: "수락 완료",
    participantType: "역할담당자",
    role: "업무 정리",
    summary: "디자인 프로젝트 인수인계",
    waitingPeriod: "7일",
    taskGroups: [
      {
        title: "작업 파일",
        tasks: [
          { title: "피그마", description: "디자인 파일 소유권 이전" },
          { title: "구글 드라이브", description: "프로젝트 폴더 공유" },
        ],
      },
      {
        title: "프로젝트 전달",
        tasks: [
          { title: "클라이언트 자료", description: "담당자 연락처와 요청 사항 전달" },
          { title: "일정 문서", description: "남은 작업 일정과 마감일 전달" },
        ],
      },
    ],
  },
  {
    id: "jimin",
    name: "유지민",
    email: "jimin_u@gmail.com",
    status: "수락 대기",
    participantType: "지정확인자",
    role: "확인자",
    summary: "사용자 사망 확인 / 날짜 전달",
    waitingPeriod: "14일",
  },
  {
    id: "sungho",
    name: "박성호",
    email: "sungho.park@gmail.com",
    status: "수락 완료",
    participantType: "지정확인자",
    role: "확인자",
    summary: "사용자 사망 확인 / 날짜 전달",
    waitingPeriod: "7일",
  },
];

const handoffChecks = [
  {
    id: "jisu",
    name: "이지수",
    participantType: "역할담당자",
    readiness: "준비 완료",
    inspectionComplete: true,
    role: "관계 정리",
    checks: [
      { label: "이메일", value: "도달 완료", complete: true },
      { label: "역할", value: "수락 완료", complete: true },
      { label: "대체 담당자", value: "도달 완료", complete: true, wide: true },
    ],
    question: "없음",
  },
  {
    id: "minsu",
    name: "김민수",
    participantType: "역할담당자",
    readiness: "준비 대기",
    inspectionComplete: false,
    role: "업무 정리",
    checks: [
      { label: "이메일", value: "도달 완료", complete: true },
      { label: "역할", value: "수락 대기", complete: false },
      { label: "대체 담당자", value: "없음", complete: false, wide: true },
    ],
    question: "말씀하신 디자인 프로젝트 저 혼자 인계받는 건가요?\n팀에 같이 넘겨야 할 사람이 있으면 미리 알아두고 싶어요.",
  },
  {
    id: "jimin",
    name: "유지민",
    participantType: "지정확인자",
    readiness: "준비 대기",
    inspectionComplete: true,
    role: "확인자",
    checks: [
      { label: "이메일", value: "도달 완료", complete: true },
      { label: "역할", value: "수락 완료", complete: true },
    ],
    question: "없음",
  },
  {
    id: "sungho",
    name: "박성호",
    participantType: "지정확인자",
    readiness: "준비 완료",
    inspectionComplete: true,
    role: "확인자",
    checks: [
      { label: "이메일", value: "도달 완료", complete: true },
      { label: "역할", value: "수락 대기", complete: true },
    ],
    question: "없음",
  },
];

function TaskGroup({ title, tasks }) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="text-sm font-bold">{title}</h3>
      {tasks.map((task) => (
        <div className="flex min-h-[66px] flex-col justify-center gap-1.5 rounded-[20px] bg-[#f0f0f2] px-5 py-[18px]" key={task.title}>
          <strong className="text-xs">{task.title}</strong>
          <p className="text-xs font-medium text-[#838383]">{task.description}</p>
        </div>
      ))}
    </section>
  );
}

function InspectionDetail({ label, value, complete, wide = false }) {
  return (
    <div className={`flex min-h-[72px] flex-col justify-center rounded-[20px] bg-[#f0f0f2] px-5 py-[18px] ${wide ? "w-full" : "min-w-0 flex-1"}`}>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1.5 text-xs">
          <strong>{label}</strong>
          <span className="font-medium text-[#838383]">{value}</span>
        </div>
        <Image
          alt={complete ? "완료" : "미완료"}
          className="size-5 shrink-0"
          height={20}
          src={complete ? "/icons/inspection/check-circle.svg" : "/icons/inspection/x-circle.svg"}
          width={20}
        />
      </div>
    </div>
  );
}

function InspectionCard({ person }) {
  const pairedChecks = person.checks.filter((check) => !check.wide);
  const wideChecks = person.checks.filter((check) => check.wide);

  return (
    <article className="flex w-full flex-col gap-3.5 rounded-[20px] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="w-[76px] text-base font-bold">{person.name}</h3>
        <span className="text-xs font-medium text-[#838383]">{person.readiness}</span>
      </div>

      <div className="flex w-full flex-col gap-3">
        <h4 className="text-sm font-bold">{person.role}</h4>
        <div className="flex gap-2.5">
          {pairedChecks.map((check) => (
            <InspectionDetail key={check.label} {...check} />
          ))}
        </div>
        {wideChecks.map((check) => (
          <InspectionDetail key={check.label} {...check} />
        ))}
      </div>

      <div className="flex min-h-[72px] w-full flex-col justify-center gap-1.5 rounded-[20px] bg-[#f0f0f2] px-5 py-[18px] text-xs">
        <strong>문의 사항</strong>
        <p className="whitespace-pre-line font-medium leading-[normal] text-[#838383]">{person.question}</p>
      </div>
    </article>
  );
}

function InspectionGroup({ participantType, title }) {
  const group = handoffChecks.filter((person) => person.participantType === participantType);
  const completedCount = group.filter((person) => person.inspectionComplete).length;

  return (
    <section className="flex w-full flex-col gap-[22px]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">{title} 총 {group.length}명</h2>
        <span className="text-sm font-medium text-[#838383]">{completedCount}명 점검 완료</span>
      </div>
      {group.map((person) => (
        <InspectionCard key={person.id} person={person} />
      ))}
    </section>
  );
}

function HandoffInspection() {
  return (
    <div className="flex w-full flex-col gap-[22px]">
      <InspectionGroup participantType="역할담당자" title="담당자" />
      <InspectionGroup participantType="지정확인자" title="확인자" />
    </div>
  );
}

function PersonButton({ person, selected, onSelect }) {
  return (
    <button
      aria-pressed={selected}
      className={`h-10 appearance-none rounded-[30px] bg-white px-4 py-0 text-sm leading-[normal] transition-colors ${
        selected
          ? "border-2 border-solid border-[#838383] font-semibold text-[#838383]"
          : "border-0 font-normal text-[#a8a8a8]"
      } ${!selected ? "hover:bg-[#e4e4e6]" : ""}`}
      onClick={() => onSelect(person.id)}
      type="button"
    >
      {person.name}
    </button>
  );
}

export default function RoleInspectionPage() {
  const [activeTab, setActiveTab] = useState("role");
  const [selectedId, setSelectedId] = useState("jisu");
  const selectedPerson = people.find((person) => person.id === selectedId) ?? people[0];
  const isVerifier = selectedPerson.participantType === "지정확인자";

  return (
    <PageContainer className="role-preview gap-[22px] pb-[100px] pt-[70px]" data-node-id="439:1777">
      <PageHeader title="점검" className="pb-1.5" />

      <nav aria-label="점검 종류" className="flex items-center gap-[30px] pb-0.5">
        <button
          aria-current={activeTab === "role" ? "page" : undefined}
          className={`border-0 bg-transparent pb-1 text-base font-bold ${activeTab === "role" ? "border-b-[1.2px] border-solid border-[#28292e] text-[#28292e]" : "text-[#a8a8a8]"}`}
          onClick={() => setActiveTab("role")}
          type="button"
        >
          역할 점검
        </button>
        <button
          aria-current={activeTab === "handoff" ? "page" : undefined}
          className={`border-0 bg-transparent pb-1 text-base font-bold ${activeTab === "handoff" ? "border-b border-solid border-[#28292e] text-[#28292e]" : "text-[#a8a8a8]"}`}
          onClick={() => setActiveTab("handoff")}
          type="button"
        >
          인계 점검
        </button>
      </nav>

      {activeTab === "role" ? <>
      <section className="flex w-full flex-col gap-3.5" aria-label="담당자별 역할">
        <div className="flex w-full items-center justify-between px-1">
          {people.map((person) => (
            <PersonButton
              key={person.id}
              person={person}
              onSelect={setSelectedId}
              selected={selectedPerson.id === person.id}
            />
          ))}
        </div>

        <article className={`flex w-full flex-col rounded-[20px] bg-white px-5 pb-[18px] pt-[30px] ${isVerifier ? "gap-[26px]" : "gap-6"}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{selectedPerson.name}님</h2>
              <span className="text-sm font-medium text-[#838383]">{selectedPerson.status}</span>
            </div>
            <p className="text-sm font-medium text-[#838383]">{selectedPerson.email}</p>
          </div>

          <section className="flex flex-col gap-2">
            <h3 className="text-base font-bold">{selectedPerson.role}</h3>
            <p className="text-sm font-medium text-[#838383]">{selectedPerson.summary}</p>
          </section>

          <section className="flex flex-col gap-2.5">
            <h3 className="text-base font-bold">대기 기간</h3>
            <p className="text-sm font-medium text-[#838383]">{selectedPerson.waitingPeriod}</p>
          </section>

          {isVerifier ? (
            <section className="flex w-full flex-col gap-1.5 rounded-[20px] bg-[#f0f0f2] px-5 py-[18px]">
              <h3 className="text-xs font-bold">사망 확인 날짜</h3>
              <p className="whitespace-nowrap text-xs font-medium text-[#838383]">
                사용자의 사망이 확인되고 날짜가 등록되면 확인 가능해요
              </p>
            </section>
          ) : (
            selectedPerson.taskGroups.map((group) => (
              <TaskGroup key={group.title} {...group} />
            ))
          )}
        </article>
      </section>

      <div className="flex w-full flex-col gap-[22px]">
        <Button className="h-[45px] w-full shrink-0" type="button">수락 요청 다시 보내기</Button>
        <OutlineButton
          className="h-[45px] w-full shrink-0"
          href={isVerifier ? "/role/verifier/edit" : "/role/manager/edit"}
        >
          {isVerifier ? "확인자 수정하기" : "담당자 수정하기"}
        </OutlineButton>
      </div>
      </> : <HandoffInspection />}
    </PageContainer>
  );
}

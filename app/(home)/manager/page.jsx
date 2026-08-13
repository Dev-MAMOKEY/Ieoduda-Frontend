"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { OutlineButton } from "@/components/OutlineButton";

const roles = [
  { id: "family", title: "가족 담당자", icon: "/icons/life-area/one.svg" },
  { id: "relation", title: "관계 정리 담당자", icon: "/icons/life-area/two.svg" },
  { id: "work", title: "업무 처리 담당자", icon: "/icons/life-area/three.svg" },
];

function ManagerSection({
  role,
  waitingPeriod,
  onPeriodChange,
  hasBackup,
  onToggleBackup,
}) {
  return (
    <fieldset className="flex w-full flex-col gap-[22px]">
      <legend className="mb-2 flex flex-col gap-2">
        <Image src={role.icon} alt="" width={24} height={24} />
        <span className="text-base font-bold">{role.title}</span>
      </legend>

      <FormField id={`${role.id}-name`} label="담당자 이름" name={`${role.id}-name`} placeholder="이름을 입력해 주세요" type="text" autoComplete="name" />
      <FormField id={`${role.id}-email`} label="담당자 이메일" name={`${role.id}-email`} placeholder="이메일을 입력해 주세요" type="email" autoComplete="email" />

      <div className="flex w-full flex-col gap-2.5">
        <span className="px-2.5 text-sm font-semibold">대기 기간</span>
        <div className="grid grid-cols-3 gap-2.5">
          {[7, 14, 21].map((days) => {
            const selected = waitingPeriod === days;
            return (
              <button
                aria-pressed={selected}
                className={`h-[45px] rounded-[20px] text-sm transition-colors ${selected ? "bg-[#838383] font-semibold text-white" : "bg-white text-[#a8a8a8] hover:bg-[#e4e4e6]"}`}
                key={days}
                onClick={() => onPeriodChange(days)}
                type="button"
              >
                {days}일
              </button>
            );
          })}
        </div>
      </div>

      <OutlineButton
        aria-expanded={hasBackup}
        className={hasBackup ? "border-[#838383] bg-white text-[#5f6065] hover:bg-[#e7e7e9]" : ""}
        onClick={onToggleBackup}
        type="button"
      >
        <Image src="/icons/verifier/user-plus.svg" alt="" width={20} height={20} />
        {hasBackup ? "대체 담당자 제거하기" : "대체 담당자 등록하기"}
      </OutlineButton>

      {hasBackup && (
        <div className="flex w-full flex-col gap-[18px] rounded-[20px] border border-[#d9d9d9] px-4 pb-5 pt-4">
          <h3 className="px-2 text-sm font-bold text-[#838383]">대체 담당자</h3>
          <FormField
            id={`${role.id}-backup-name`}
            label="대체 담당자 이름"
            name={`${role.id}-backup-name`}
            placeholder="이름을 입력해 주세요"
            type="text"
            autoComplete="name"
          />
          <FormField
            id={`${role.id}-backup-email`}
            label="대체 담당자 이메일"
            name={`${role.id}-backup-email`}
            placeholder="이메일을 입력해 주세요"
            type="email"
            autoComplete="email"
          />
        </div>
      )}
    </fieldset>
  );
}

export default function ManagerPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState({ family: null, relation: null, work: null });
  const [backups, setBackups] = useState({
    family: false,
    relation: false,
    work: false,
  });

  const setPeriod = (roleId, days) => {
    setPeriods((current) => ({
      ...current,
      [roleId]: current[roleId] === days ? null : days,
    }));
  };

  const toggleBackup = (roleId) => {
    setBackups((current) => ({
      ...current,
      [roleId]: !current[roleId],
    }));
  };

  return (
    <PageContainer className="gap-[22px] py-[70px]" data-node-id="439:1487">
      <PageHeader title="역할 담당자 등록" backHref="/plan" backLabel="직전 화면으로 돌아가기" history className="pb-5" />

      <form
        className="flex w-full flex-col gap-[30px]"
        onSubmit={(event) => {
          event.preventDefault();
          router.push("/plan");
        }}
      >
        {roles.map((role, index) => (
          <div className="flex flex-col gap-[30px]" key={role.id}>
            <ManagerSection
              hasBackup={backups[role.id]}
              onToggleBackup={() => toggleBackup(role.id)}
              onPeriodChange={(days) => setPeriod(role.id, days)}
              role={role}
              waitingPeriod={periods[role.id]}
            />
            {index < roles.length - 1 && <hr className="border-0 border-t border-[#d0d0d2]" />}
          </div>
        ))}

        <Button type="submit">등록하기</Button>
      </form>
    </PageContainer>
  );
}

"use client";

// 계획의 기본 정보와 처리 방식을 입력하고 선택하는 반응형 작성 폼입니다.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/components/shared/ui/BackButton";
import { ChoiceGroup } from "./components/ChoiceGroup";
import { SectionTitle, Subsection } from "./components/PlanFormHeadings";
import {
  emptyPlanValues,
  existingPlanValues,
  planOptions,
} from "./data/planFormData";
import type {
  PlanFormValues,
  PlanSelectionKey,
  RequiredPlanField,
} from "./model/planTypes";

type PlanFormProps = {
  editMode: boolean;
};

const fieldClassName =
  "h-[45px] w-full rounded-[20px] border bg-white px-5 text-sm text-[#28292e] outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 lg:h-[52px] lg:rounded-[30px] lg:text-base";

export function PlanForm({ editMode }: PlanFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<PlanFormValues>(
    editMode ? existingPlanValues : emptyPlanValues,
  );
  const [requiredErrors, setRequiredErrors] = useState<RequiredPlanField[]>([]);

  const selectValue = (key: PlanSelectionKey, value: string) => {
    setValues((current) => ({
      ...current,
      [key]: current[key] === value ? "" : value,
    }));

    if (key === "waitingPeriod") {
      setRequiredErrors((current) =>
        current.filter((field) => field !== "waitingPeriod"),
      );
    }
  };

  const validateRequiredFields = () => {
    const nextErrors: RequiredPlanField[] = [];

    if (!values.name.trim()) nextErrors.push("name");
    if (!values.waitingPeriod) nextErrors.push("waitingPeriod");

    setRequiredErrors(nextErrors);

    if (nextErrors.length === 0) {
      router.push("/plan/life-area");
    }
  };

  const nameHasError = requiredErrors.includes("name");
  const waitingPeriodHasError = requiredErrors.includes("waitingPeriod");

  return (
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-[22px] px-6 py-[70px] lg:max-w-none lg:px-0 lg:pb-[90px] lg:pt-0">
      <header className="flex w-full items-center justify-between pb-5 lg:px-[60px] lg:pb-0">
        <BackButton href="/plan" label="계획 홈으로 돌아가기" />
        <h1 className="text-lg font-bold text-[#28292e] lg:text-xl">계획 작성</h1>
        <span className="size-6" aria-hidden />
      </header>

      <div className="flex flex-col gap-[22px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-[50px] lg:px-[120px]">
        <div className="flex flex-col gap-[22px] lg:gap-[50px]">
          <section className="flex flex-col gap-2.5">
            <SectionTitle>계획 이름</SectionTitle>
            <input
              aria-describedby={nameHasError ? "plan-name-error" : undefined}
              aria-invalid={nameHasError}
              className={`${fieldClassName} ${nameHasError ? "border-[#efb1b1] focus-visible:ring-[#e89191]/40" : "border-transparent focus-visible:ring-[#28292e]/20"}`}
              onChange={(event) => {
                setValues((current) => ({ ...current, name: event.target.value }));
                setRequiredErrors((current) => current.filter((field) => field !== "name"));
              }}
              placeholder="계획 이름을 입력해 주세요"
              type="text"
              value={values.name}
            />
            {nameHasError && (
              <p className="px-2.5 text-xs font-medium text-[#d66565]" id="plan-name-error" role="alert">
                계획 이름을 작성해주세요.
              </p>
            )}
          </section>

          <hr className="border-0 border-t border-[#bdbdbd] lg:hidden" />

          <section className="flex flex-col gap-2.5">
            <SectionTitle>가족･친구･지인 담당자에게</SectionTitle>
            <input className={`${fieldClassName} border-transparent focus-visible:ring-[#28292e]/20`} onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))} placeholder="전달할 내용을 입력해 주세요" type="text" value={values.message} />
          </section>

          <hr className="border-0 border-t border-[#bdbdbd] lg:hidden" />

          <section className="flex flex-col gap-[18px] lg:gap-[10px]">
            <SectionTitle>관계 정리</SectionTitle>
            <Subsection label="SNS 계정 처리">
              <ChoiceGroup selectionKey="socialAccount" options={planOptions.socialAccount} value={values.socialAccount} onSelect={selectValue} desktopColumns={4} />
            </Subsection>
            <Subsection label="메신저·연락처로 부고 전달">
              <ChoiceGroup selectionKey="obituary" options={planOptions.obituary} value={values.obituary} onSelect={selectValue} />
            </Subsection>
          </section>
        </div>

        <hr className="border-0 border-t border-[#bdbdbd] lg:hidden" />

        <div className="flex flex-col gap-[22px] lg:gap-[50px]">
          <section className="flex flex-col gap-[15px] lg:gap-[10px]">
            <SectionTitle>업무 정리</SectionTitle>
            <Subsection label="업무 계정･이메일">
              <ChoiceGroup selectionKey="workAccount" options={planOptions.workAccount} value={values.workAccount} onSelect={selectValue} />
            </Subsection>
            <Subsection label="진행 중인 일·거래처 인계">
              <ChoiceGroup selectionKey="workHandover" options={planOptions.workHandover} value={values.workHandover} onSelect={selectValue} />
            </Subsection>
          </section>

          <hr className="border-0 border-t border-[#bdbdbd] lg:hidden" />

          <section className="flex flex-col gap-3.5">
            <SectionTitle>대기 기간</SectionTitle>
            <ChoiceGroup selectionKey="waitingPeriod" options={planOptions.waitingPeriod} value={values.waitingPeriod} onSelect={selectValue} equalWidth invalid={waitingPeriodHasError} />
            {waitingPeriodHasError && (
              <p className="px-2.5 text-xs font-medium text-[#d66565]" role="alert">
                대기 기간을 선택해주세요.
              </p>
            )}
          </section>

          <hr className="border-0 border-t border-[#bdbdbd] lg:hidden" />

          <section className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-3">
              <SectionTitle>이의제기 연락처 등록 안내</SectionTitle>
              <div className="flex flex-col gap-1 px-2.5 text-xs font-medium text-[#838383] lg:text-sm">
                <p>등록하면 계획이 실수로 실행되는 걸 막을 수 있어요</p>
                <p>대기 기간 동안 등록한 사람에게 이의를 제기하면 실행이 멈춰요</p>
                <p>믿을 수 있는 가족·지인을 등록해 주세요</p>
              </div>
            </div>
            <ChoiceGroup selectionKey="objectionContact" options={planOptions.objectionContact} value={values.objectionContact} onSelect={selectValue} />
          </section>

          <div className="flex flex-col items-center gap-[18px] lg:gap-5">
            <button className="flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors hover:bg-[#929292] lg:h-[52px] lg:rounded-[30px] lg:text-base" onClick={validateRequiredFields} type="button">
              세부 사항 대화하기
            </button>
            <p className="text-center text-[13px] font-medium text-[#838383] lg:text-sm">
              AI와 대화로 계획을 세부적으로 작성할 수 있어요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

// 계획의 기본 정보와 처리 방식을 입력하고 선택하는 반응형 작성 폼입니다.
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SelectionKey =
  | "socialAccount"
  | "obituary"
  | "workAccount"
  | "workHandover"
  | "waitingPeriod"
  | "objectionContact";

type PlanFormValues = Record<SelectionKey, string> & {
  name: string;
  message: string;
};

type PlanFormProps = {
  editMode: boolean;
};

const emptyValues: PlanFormValues = {
  name: "",
  message: "",
  socialAccount: "",
  obituary: "",
  workAccount: "",
  workHandover: "",
  waitingPeriod: "",
  objectionContact: "",
};

const existingPlanValues: PlanFormValues = {
  name: "나의 계획",
  message: "가족･친구･지인에게 전달할 메시지",
  socialAccount: "삭제",
  obituary: "전달",
  workAccount: "인수인계",
  workHandover: "인수인계",
  waitingPeriod: "14일",
  objectionContact: "등록",
};

const fieldClassName =
  "h-[45px] w-full rounded-[20px] border bg-white px-5 text-sm text-[#28292e] outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 lg:h-[52px] lg:rounded-[30px] lg:text-base";

function ChoiceGroup({
  selectionKey,
  options,
  value,
  onSelect,
  equalWidth = false,
  desktopColumns,
  invalid = false,
}: {
  selectionKey: SelectionKey;
  options: readonly string[];
  value: string;
  onSelect: (key: SelectionKey, value: string) => void;
  equalWidth?: boolean;
  desktopColumns?: 4;
  invalid?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 lg:gap-4">
      {options.map((option) => {
        const selected = value === option;

        return (
          <button
            aria-pressed={selected}
            className={`${equalWidth ? "min-w-0 flex-1" : ""} ${desktopColumns === 4 ? "lg:basis-[calc((100%_-_48px)/4)] lg:flex-none" : "lg:flex-1"} whitespace-nowrap rounded-[30px] border px-5 py-3 text-sm transition-colors lg:text-base ${
              selected
                ? "border-[#6e6e6e] bg-[#6e6e6e] text-white"
                : invalid
                  ? "border-[#efb1b1] bg-white text-[#a8a8a8] hover:bg-[#e7e7e9]"
                  : "border-transparent bg-white text-[#a8a8a8] hover:bg-[#e7e7e9]"
            }`}
            key={option}
            onClick={() => onSelect(selectionKey, option)}
            type="button"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="px-2.5 text-base font-bold text-[#28292e]">{children}</h2>;
}

function Subsection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="px-2.5 text-sm font-medium text-[#28292e]">{label}</h3>
      {children}
    </div>
  );
}

export function PlanForm({ editMode }: PlanFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<PlanFormValues>(
    editMode ? existingPlanValues : emptyValues,
  );
  const [requiredErrors, setRequiredErrors] = useState<
    ("name" | "waitingPeriod")[]
  >([]);

  const selectValue = (key: SelectionKey, value: string) => {
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
    const nextErrors: ("name" | "waitingPeriod")[] = [];

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
        <Link aria-label="계획 홈으로 돌아가기" href="/plan">
          <Image
            className="rotate-180"
            src="/icons/common/caret-right.svg"
            alt=""
            width={24}
            height={24}
          />
        </Link>
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
              <ChoiceGroup selectionKey="socialAccount" options={["삭제", "추모 전환", "비공개", "기타", "해당 없음"]} value={values.socialAccount} onSelect={selectValue} desktopColumns={4} />
            </Subsection>
            <Subsection label="메신저·연락처로 부고 전달">
              <ChoiceGroup selectionKey="obituary" options={["전달", "전달 안함", "친한 지인"]} value={values.obituary} onSelect={selectValue} />
            </Subsection>
          </section>
        </div>

        <hr className="border-0 border-t border-[#bdbdbd] lg:hidden" />

        <div className="flex flex-col gap-[22px] lg:gap-[50px]">
          <section className="flex flex-col gap-[15px] lg:gap-[10px]">
            <SectionTitle>업무 정리</SectionTitle>
            <Subsection label="업무 계정･이메일">
              <ChoiceGroup selectionKey="workAccount" options={["인수인계", "삭제"]} value={values.workAccount} onSelect={selectValue} />
            </Subsection>
            <Subsection label="진행 중인 일·거래처 인계">
              <ChoiceGroup selectionKey="workHandover" options={["인수인계", "인계 안함"]} value={values.workHandover} onSelect={selectValue} />
            </Subsection>
          </section>

          <hr className="border-0 border-t border-[#bdbdbd] lg:hidden" />

          <section className="flex flex-col gap-3.5">
            <SectionTitle>대기 기간</SectionTitle>
            <ChoiceGroup selectionKey="waitingPeriod" options={["7일", "14일", "22일"]} value={values.waitingPeriod} onSelect={selectValue} equalWidth invalid={waitingPeriodHasError} />
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
            <ChoiceGroup selectionKey="objectionContact" options={["등록", "등록 안함"]} value={values.objectionContact} onSelect={selectValue} />
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

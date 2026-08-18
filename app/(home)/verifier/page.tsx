"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { getApiErrorMessage } from "@/lib/api/auth";
import { getMyPlan, registerConfirmers } from "@/lib/api/plan";

const CONFIRMER_COUNT = 2;
type FieldErrors = Record<string, string>;

function TextField({ index, kind, label, placeholder, type = "text", error }: {
  index: number;
  kind: "name" | "email";
  label: string;
  placeholder: string;
  type?: "text" | "email";
  error?: string;
}) {
  const id = `verifier-${kind}-${index + 1}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex w-full flex-col gap-2.5 md:gap-2">
      <label className="px-2.5 text-sm font-bold leading-none text-[#43306d] md:text-base" htmlFor={id}>{label}</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={kind === "name" ? "name" : "email"}
        className={`min-h-[48px] w-full rounded-[14px] border bg-[#fbfafd] px-4 py-[14px] text-[13px] font-medium leading-none text-[#584e4d] outline-none placeholder:text-[#a99d9e] focus-visible:ring-2 md:px-5 md:py-4 md:text-[15px] ${error ? "border-red-500 focus-visible:ring-red-500/25" : "border-transparent focus-visible:ring-[#43306d]/25"}`}
        id={id}
        maxLength={kind === "name" ? 50 : 254}
        name={`verifiers[${index}].${kind}`}
        placeholder={placeholder}
        required
        type={type}
      />
      {error && <p className="px-2.5 text-xs font-medium text-red-600" id={errorId} role="alert">{error}</p>}
    </div>
  );
}

function WaitingPeriodField({ index, error }: { index: number; error?: string }) {
  const id = `waiting-period-${index + 1}`;
  const errorId = `${id}-error`;

  return (
    <div className="flex w-full flex-col gap-2.5 md:gap-2">
      <label className="px-2.5 text-sm font-bold leading-none text-[#43306d] md:text-base" htmlFor={id}>대기 기간</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`min-h-[48px] w-full rounded-[14px] border bg-[#fbfafd] px-4 py-[14px] text-[13px] font-medium leading-none text-[#584e4d] outline-none placeholder:text-[#a99d9e] focus-visible:ring-2 md:px-5 md:py-4 md:text-[15px] ${error ? "border-red-500 focus-visible:ring-red-500/25" : "border-transparent focus-visible:ring-[#43306d]/25"}`}
        id={id}
        inputMode="numeric"
        max={30}
        min={7}
        name={`verifiers[${index}].waitingPeriod`}
        placeholder="대기 기간을 입력해 주세요 (7-30일)"
        required
        type="number"
      />
      {error && <p className="px-2.5 text-xs font-medium text-red-600" id={errorId} role="alert">{error}</p>}
    </div>
  );
}

function ConfirmerFields({ index, errors }: { index: number; errors: FieldErrors }) {
  return (
    <fieldset className="flex w-full flex-col gap-2">
      <legend className="sr-only">지정 확인자 {index + 1}</legend>
      <div className="flex w-full items-center rounded-[16px] bg-[#f3f3ff] px-5 py-[18px]">
        <Image alt={`${index + 1}번 확인자`} height={24} src={`/icons/verifier/number-${index === 0 ? "one" : "two"}.svg`} width={24} />
      </div>
      <div className="flex w-full flex-col gap-3 pb-3">
        <TextField error={errors[`verifiers[${index}].name`]} index={index} kind="name" label="담당자 이름" placeholder="이름을 입력해 주세요" />
        <TextField error={errors[`verifiers[${index}].email`]} index={index} kind="email" label="담당자 이메일" placeholder="이메일을 입력해 주세요" type="email" />
        <WaitingPeriodField error={errors[`verifiers[${index}].waitingPeriod`]} index={index} />
      </div>
    </fieldset>
  );
}

export default function VerifierPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrorMessage("");
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const confirmers = Array.from({ length: CONFIRMER_COUNT }, (_, index) => ({
      name: String(formData.get(`verifiers[${index}].name`) ?? "").trim(),
      email: String(formData.get(`verifiers[${index}].email`) ?? "").trim(),
    }));

    const nextErrors: FieldErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    confirmers.forEach((person, index) => {
      const nameKey = `verifiers[${index}].name`;
      const emailKey = `verifiers[${index}].email`;
      const waitingPeriodKey = `verifiers[${index}].waitingPeriod`;
      const waitingPeriodValue = String(formData.get(waitingPeriodKey) ?? "").trim();
      const waitingPeriod = Number(waitingPeriodValue);

      if (!person.name) nextErrors[nameKey] = "담당자 이름을 입력해 주세요.";
      if (!person.email) nextErrors[emailKey] = "담당자 이메일을 입력해 주세요.";
      else if (!emailPattern.test(person.email)) nextErrors[emailKey] = "올바른 이메일 형식으로 입력해 주세요.";

      if (!waitingPeriodValue) nextErrors[waitingPeriodKey] = "대기 기간을 입력해 주세요.";
      else if (!Number.isInteger(waitingPeriod) || waitingPeriod < 7 || waitingPeriod > 30) {
        nextErrors[waitingPeriodKey] = "대기 기간은 7~30일 사이의 정수로 입력해 주세요.";
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setPending(false);
      return;
    }

    try {
      const plan = await getMyPlan();
      await registerConfirmers(plan.planId, confirmers);
      router.push("/life-area");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "지정 확인자를 등록하지 못했습니다."));
      setPending(false);
    }
  };

  return (
    <PageContainer className="gap-3 pb-8 pt-[70px] md:!px-[120px] md:!pb-[50px] md:!pt-0" data-node-id="454:2817">
      <header className="mx-auto grid w-full max-w-[342px] grid-cols-[24px_1fr_24px] items-center px-1 py-2 md:max-w-[460px] md:grid-cols-[28px_1fr_28px] md:px-0 md:py-0">
        <BackButton href="/plan-info" label="계획 작성 안내로 돌아가기" />
        <h1 className="text-center text-lg font-bold leading-none text-[#43306d] md:text-xl">지정 확인자 등록</h1>
        <span aria-hidden className="size-6 md:size-7" />
      </header>

      <div className="mx-auto flex w-full max-w-[342px] flex-col gap-[26px] md:max-w-[460px] md:gap-10 md:pt-[38px]">
        <form
          className="flex w-full flex-col gap-5 md:gap-10"
          noValidate
          onChange={(event) => {
            if (!(event.target instanceof HTMLInputElement)) return;
            const fieldName = event.target.name;
            if (!fieldName || !fieldErrors[fieldName]) return;
            setFieldErrors((current) => {
              const next = { ...current };
              delete next[fieldName];
              return next;
            });
          }}
          onSubmit={handleSubmit}
        >
          <div className="flex w-full flex-col gap-5 md:gap-10">
            {Array.from({ length: CONFIRMER_COUNT }, (_, index) => <ConfirmerFields errors={fieldErrors} index={index} key={index} />)}
          </div>

          {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
          <Button className="mt-[2px] text-sm md:mt-0 md:text-base" disabled={pending} type="submit">{pending ? "등록 중..." : "등록하기"}</Button>
        </form>

        <aside className="flex w-full flex-col items-start rounded-[16px] bg-[#f3f3ff] px-5 pb-5 pt-[18px] md:rounded-[20px] md:pb-[22px] md:pt-5">
          <div className="flex flex-col gap-2.5 md:gap-[21px]">
            <div className="flex flex-col gap-2 md:gap-2.5">
              <Image alt="" height={24} src="/icons/verifier/check-circle-figma.svg" width={24} className="size-[22px] md:size-6" />
              <h2 className="text-sm font-bold leading-none text-[#43306d] md:text-base">확인자가 맡는 일</h2>
            </div>
            <p className="text-xs font-medium leading-normal text-[#796b6c] md:text-sm">
              나중에 다른 확인자와 함께 사망 사실을 확인해 달라는 요청을 받게 되고, 두 사람의 확인이 모이면 계획이 시작돼요. 안내는 수락요청 메일에도 함께 전달돼요.
            </p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

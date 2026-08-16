// 로그인 성공 후 토큰을 저장하고 사후 인계 동의 상태에 따라 이동 경로를 결정하는 화면입니다.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { getApiErrorMessage, login } from "@/lib/api/auth";
import { getConsent, getMyPlan, getRoleChecks } from "@/lib/api/plan";
import {
  hasFieldErrors,
  validateLogin,
  type FieldErrors,
  type LoginValues,
} from "@/lib/validation/auth";

const fields = [
  {
    id: "email",
    label: "이메일",
    type: "email",
    autoComplete: "email",
    placeholder: "이메일을 입력해주세요",
  },
  {
    id: "password",
    label: "비밀번호",
    type: "password",
    autoComplete: "current-password",
    placeholder: "비밀번호를 입력해주세요",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginValues>>({});
  const [pending, setPending] = useState(false);

  const clearFieldError = (field: keyof LoginValues) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const values = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };
    const validationErrors = validateLogin(values);

    // API 요청 전에 필드별 입력값을 검증하고 오류를 각 입력창 아래에 표시합니다.
    if (hasFieldErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      return;
    }

    setPending(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      // 로그인 성공 시 토큰을 저장하고 로그인 이후 안내 화면으로 이동합니다.
      await login(values);
      // 로그인 직후 동의 상태를 조회해 신규·기존 사용자 흐름을 나눕니다.
      const consent = await getConsent();
      if (!consent.agreed) {
        router.replace("/service-info");
        return;
      }

      // 동의한 사용자는 지정 확인자 등록 여부에 따라 계획 시작 화면을 결정합니다.
      const plan = await getMyPlan();
      const roleChecks = await getRoleChecks(plan.planId);
      const hasConfirmer = roleChecks.some((role) => role.type === "CONFIRMER");
      router.replace(hasConfirmer ? "/plan" : "/plan-info");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "로그인에 실패했습니다."));
      setPending(false);
    }
  };

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e] md:max-w-none md:flex-col md:p-0"
      data-node-id="439:1136"
    >
      <div className="hidden min-h-0 w-full flex-1 md:block" />
      <form
        className="flex w-full flex-col gap-5 md:w-[460px] md:gap-6"
        noValidate
        onSubmit={handleSubmit}
      >
        <h1 className="text-[22px] font-bold leading-normal">로그인</h1>

        {fields.map((field) => (
          <FormField
            autoComplete={field.autoComplete}
            error={fieldErrors[field.id as keyof LoginValues]}
            id={field.id}
            key={field.id}
            label={field.label}
            name={field.id}
            onChange={() => clearFieldError(field.id as keyof LoginValues)}
            placeholder={field.placeholder}
            required
            type={field.type}
          />
        ))}

        {errorMessage && (
          <p className="px-2.5 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        )}

        <Button disabled={pending} type="submit">
          {pending ? "로그인 중..." : "로그인하기"}
        </Button>

        <p className="flex w-full items-center justify-center gap-2 text-sm whitespace-nowrap">
          <span className="text-[#a8a8a8]">아직 회원이 아니신가요?</span>
          <Link className="underline underline-offset-2" href="/signup">
            회원가입하기
          </Link>
        </p>
      </form>
      <div className="hidden min-h-0 w-full flex-1 md:block" />
    </main>
  );
}

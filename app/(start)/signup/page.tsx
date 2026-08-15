"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { DesktopHeader } from "@/components/DesktopHeader";
import { FormField } from "@/components/FormField";
import { getApiErrorMessage, signup } from "@/lib/api/auth";
import {
  hasFieldErrors,
  validateSignup,
  type FieldErrors,
  type SignupValues,
} from "@/lib/validation/auth";

const fields = [
  {
    id: "name",
    label: "이름",
    type: "text",
    autoComplete: "name",
    placeholder: "이름을 입력해주세요",
  },
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
    autoComplete: "new-password",
    placeholder: "비밀번호를 입력해주세요",
  },
  {
    id: "passwordConfirm",
    label: "비밀번호 확인",
    type: "password",
    autoComplete: "new-password",
    placeholder: "비밀번호를 입력해주세요",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<SignupValues>>({});
  const [pending, setPending] = useState(false);

  const clearFieldError = (field: keyof SignupValues) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const formData = new FormData(event.currentTarget);
    const values = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
    };
    const validationErrors = validateSignup(values);

    // API 요청 전에 필수값, 이메일 형식, 비밀번호 일치 여부를 검증합니다.
    if (hasFieldErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      return;
    }

    setPending(true);
    setErrorMessage("");
    setFieldErrors({});

    try {
      // 회원가입 성공 후 사용자가 로그인할 수 있도록 로그인 화면으로 이동합니다.
      await signup(values);
      router.replace("/login?signup=success");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "회원가입에 실패했습니다."));
      setPending(false);
    }
  };

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e] md:max-w-none md:flex-col md:p-0"
      data-node-id="439:1226"
    >
      <DesktopHeader />
      <div className="hidden min-h-0 w-full flex-1 md:block" />
      <form
        className="flex w-full flex-col gap-5 md:w-[460px] md:gap-6"
        noValidate
        onSubmit={handleSubmit}
      >
        <h1 className="text-[22px] font-bold leading-normal">회원가입</h1>

        {fields.map((field) => (
          <FormField
            autoComplete={field.autoComplete}
            error={fieldErrors[field.id as keyof SignupValues]}
            id={field.id}
            key={field.id}
            label={field.label}
            name={field.id}
            onChange={() => clearFieldError(field.id as keyof SignupValues)}
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
          {pending ? "가입 중..." : "회원가입하기"}
        </Button>

        <p className="flex w-full items-center justify-center gap-2 text-sm whitespace-nowrap">
          <span className="text-[#a8a8a8]">이미 계정이 있으신가요?</span>
          <Link className="underline underline-offset-2" href="/login">
            로그인하기
          </Link>
        </p>
      </form>
      <div className="hidden min-h-0 w-full flex-1 md:block" />
    </main>
  );
}

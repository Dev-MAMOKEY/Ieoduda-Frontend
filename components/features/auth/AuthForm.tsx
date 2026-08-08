// 컴포넌트에서 상태 변경, 동작 등을 사용하려면 use client를 사용해야 함.
"use client";

// 로그인과 회원가입 화면이 공유하는 반응형 입력 폼과 화면 이동 링크를 렌더링합니다.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";
import { primaryActionClassName } from "@/components/shared/ui/actionStyles";
import type { AuthFormProps } from "./model/authTypes";

// 전달받은 설정에 따라 로그인 또는 회원가입 입력 화면을 렌더링합니다.
export function AuthForm({
  variant,
  title,
  fields,
  submitLabel,
  prompt,
  linkLabel,
  linkHref,
  submitHref,
}: AuthFormProps) {
  const router = useRouter();
  const [emptyFieldIds, setEmptyFieldIds] = useState<string[]>([]);
  const isSignup = variant === "signup";

  // 제출 시 빈 필드를 검증하고, 문제가 없으면 설정된 다음 화면으로 이동합니다.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextEmptyFieldIds = fields
      .filter((field) => !String(formData.get(field.id) ?? "").trim())
      .map((field) => field.id);

    setEmptyFieldIds(nextEmptyFieldIds);

    if (nextEmptyFieldIds.length === 0 && submitHref) {
      router.push(submitHref);
    }
  };

  // 사용자가 값을 다시 입력한 필드의 오류 상태를 즉시 제거합니다.
  const clearFieldError = (fieldId: string) => {
    setEmptyFieldIds((current) => current.filter((id) => id !== fieldId));
  };

  return (
    <main className="flex min-h-dvh justify-center bg-[#f0f0f2] lg:min-h-screen lg:flex-col">
      <DesktopHeader />

      <section className="flex min-h-dvh w-full max-w-[390px] items-center bg-[#f0f0f2] px-6 py-[70px] lg:min-h-0 lg:max-w-none lg:flex-1 lg:justify-center lg:px-[120px] lg:pb-[200px] lg:pt-0">
        <form
          className="flex w-full flex-col gap-5 lg:w-[460px]"
          noValidate
          onSubmit={handleSubmit}
        >
          <h1 className="text-[22px] font-bold leading-normal text-[#28292e]">
            {title}
          </h1>

          {fields.map((field) => {
            const hasError = emptyFieldIds.includes(field.id);
            const errorId = `${field.id}-error`;

            return (
            <div className="flex w-full flex-col gap-2" key={field.id}>
              <label
                className="px-[10px] text-base font-semibold leading-normal text-[#28292e]"
                htmlFor={field.id}
              >
                {field.label}
              </label>
              <input
                aria-describedby={hasError ? errorId : undefined}
                aria-invalid={hasError}
                className={`h-[41px] w-full rounded-[20px] border bg-white px-5 text-sm text-[#28292e] outline-none transition-colors placeholder:text-[#a8a8a8] focus-visible:ring-2 lg:h-[52px] lg:text-base ${hasError ? "border-[#efb1b1] focus-visible:ring-[#e89191]/40" : "border-transparent focus-visible:ring-[#28292e]/30"} ${isSignup ? "lg:rounded-[30px]" : "lg:rounded-[20px]"}`}
                id={field.id}
                name={field.id}
                onChange={() => clearFieldError(field.id)}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
              />
              {hasError && (
                <p
                  className="px-[10px] text-xs font-medium text-[#d66565]"
                  id={errorId}
                  role="alert"
                >
                  {field.label}을(를) 작성해주세요.
                </p>
              )}
            </div>
            );
          })}

          <button
            className={primaryActionClassName}
            type="submit"
          >
            {submitLabel}
          </button>

          <p className="flex w-full items-center justify-center gap-2 text-sm leading-normal whitespace-nowrap">
            <span className="text-[#a8a8a8]">{prompt}</span>
            <Link
              className="text-[#28292e] underline underline-offset-2"
              href={linkHref}
            >
              {linkLabel}
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

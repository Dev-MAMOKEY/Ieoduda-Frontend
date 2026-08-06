// 로그인과 회원가입 화면이 공유하는 반응형 입력 폼과 화면 이동 링크를 렌더링합니다.
import Link from "next/link";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";
import { primaryActionClassName } from "@/components/shared/ui/actionStyles";

export type AuthField = {
  id: string;
  label: string;
  type: "email" | "password";
  autoComplete: string;
  placeholder: string;
};

export type AuthFormProps = {
  variant: "login" | "signup";
  title: string;
  fields: readonly AuthField[];
  submitLabel: string;
  prompt: string;
  linkLabel: string;
  linkHref: string;
  submitHref?: string;
};

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
  const isSignup = variant === "signup";

  return (
    <main className="flex min-h-dvh justify-center bg-[#f0f0f2] lg:min-h-screen lg:flex-col">
      <DesktopHeader />

      <section className="flex min-h-dvh w-full max-w-[390px] items-center bg-[#f0f0f2] px-6 py-[70px] lg:min-h-0 lg:max-w-none lg:flex-1 lg:justify-center lg:px-[120px] lg:pb-[200px] lg:pt-0">
        <form className="flex w-full flex-col gap-5 lg:w-[460px]">
          <h1 className="text-[22px] font-bold leading-normal text-[#28292e]">
            {title}
          </h1>

          {fields.map((field) => (
            <div className="flex w-full flex-col gap-2" key={field.id}>
              <label
                className="px-[10px] text-base font-semibold leading-normal text-[#28292e]"
                htmlFor={field.id}
              >
                {field.label}
              </label>
              <input
                className={`h-[41px] w-full rounded-[20px] border-0 bg-white px-5 text-sm text-[#28292e] outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 focus-visible:ring-[#28292e]/30 lg:h-[52px] lg:text-base ${isSignup ? "lg:rounded-[30px]" : "lg:rounded-[20px]"}`}
                id={field.id}
                name={field.id}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {submitHref ? (
            <Link
              className={primaryActionClassName}
              href={submitHref}
            >
              {submitLabel}
            </Link>
          ) : (
            <button
              className={primaryActionClassName}
              type="submit"
            >
              {submitLabel}
            </button>
          )}

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

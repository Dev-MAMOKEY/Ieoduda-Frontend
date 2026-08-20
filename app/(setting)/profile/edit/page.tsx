"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage, logout } from "@/lib/api/auth";
import { updateCurrentUser } from "@/lib/api/user";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { showSnackbarAfterNavigation } from "@/lib/ui/snackbar";
import type { ChangeEvent, FormEvent } from "react";

type FieldErrors = Partial<Record<"name" | "email", string>>;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileEditPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (user) queueMicrotask(() => setProfile({ name: user.name, email: user.email }));
  }, [user]);
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name as keyof FieldErrors;
    setProfile((p) => ({ ...p, [fieldName]: e.target.value }));
    if (fieldErrors[fieldName]) {
      setFieldErrors((current) => ({ ...current, [fieldName]: undefined }));
    }
  };
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = profile.name.trim();
    const email = profile.email.trim();
    const errors: FieldErrors = {};

    if (!name) errors.name = "이름을 입력해 주세요.";
    if (!email) errors.email = "이메일을 입력해 주세요.";
    else if (!emailPattern.test(email)) errors.email = "올바른 이메일 형식으로 입력해 주세요.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setPending(true);
    setErrorMessage("");
    try {
      await updateCurrentUser({ name, email });
      // 서버 로그아웃 요청이 실패해도 logout()의 finally에서 로컬 인증 정보는 정리됩니다.
      await logout().catch(() => undefined);
      showSnackbarAfterNavigation("개인정보가 변경되었습니다. 다시 로그인해 주세요.");
      router.replace("/login");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "개인정보를 변경하지 못했습니다."));
      setPending(false);
    }
  };
  return (
    <PageContainer
      className="gap-0 pb-9 pt-[70px] md:min-h-[calc(100dvh-125px)] md:max-w-none md:px-[120px] md:pb-[50px] md:pt-0"
      data-node-id="545:909"
    >
      <PageHeader
        backHref="/profile"
        title="개인정보 수정"
      />
      <form className="mx-auto flex w-full flex-col gap-5 pt-5 md:max-w-[460px] md:gap-[30px] md:pt-[50px]" noValidate onSubmit={submit}>
        <div className="flex flex-col gap-[18px] pb-[14px] md:gap-[30px]">
          <h2 className="text-base font-bold text-[#43306d] md:text-lg md:text-[#28292e]">사용자</h2>
          <div className="flex flex-col gap-[14px] md:gap-5">
            <FormField
              error={fieldErrors.name}
              id="profile-name"
              label="이름"
              maxLength={50}
              name="name"
              value={profile.name}
              onChange={change}
              placeholder="이름을 입력해 주세요"
              required
            />
            <FormField
              error={fieldErrors.email}
              id="profile-email"
              label="이메일"
              maxLength={254}
              name="email"
              type="email"
              value={profile.email}
              onChange={change}
              placeholder="이메일을 입력해 주세요"
              required
            />
          </div>
        </div>
        {errorMessage && <p className="text-center text-sm text-red-700" role="alert">{errorMessage}</p>}
        <Button disabled={pending} type="submit">
          {pending ? "변경 중" : "변경하기"}
        </Button>
      </form>
    </PageContainer>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

type FieldErrors = Partial<Record<"name" | "email", string>>;

export default function EditRoleManagerPage() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const nextErrors: FieldErrors = {};

    if (!name) nextErrors.name = "담당자 이름을 입력해 주세요.";
    if (!email) nextErrors.email = "담당자 이메일을 입력해 주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "올바른 이메일 형식으로 입력해 주세요.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) router.push("/role");
  };

  return (
    <PageContainer
      className="gap-[22px] py-[70px] md:min-h-[calc(100dvh-125px)] md:max-w-none md:gap-10 md:px-[120px] md:pb-[50px] md:pt-0"
      data-node-id="522:2575"
    >
      <PageHeader
        backHref="/role"
        backLabel="역할별 패키지 미리보기로 돌아가기"
        className="pb-5 md:pb-0"
        title="담당자 수정"
      />
      <div className="mx-auto flex w-full flex-col gap-10 md:max-w-[460px]">
        <form
          className="flex w-full flex-col gap-[22px]"
          noValidate
          onChange={(event) => {
            if (!(event.target instanceof HTMLInputElement)) return;
            const fieldName = event.target.name as keyof FieldErrors;
            if (!fieldErrors[fieldName]) return;
            setFieldErrors((current) => ({ ...current, [fieldName]: undefined }));
          }}
          onSubmit={handleSubmit}
        >
          <h2 className="text-base font-bold md:text-lg">관계 정리 담당자</h2>
          <FormField
            autoComplete="name"
            id="manager-name"
            label="담당자 이름"
            error={fieldErrors.name}
            maxLength={50}
            name="name"
            placeholder="이름을 입력해 주세요"
            required
            type="text"
          />
          <FormField
            autoComplete="email"
            id="manager-email"
            label="담당자 이메일"
            error={fieldErrors.email}
            maxLength={254}
            name="email"
            placeholder="이메일을 입력해 주세요"
            required
            type="email"
          />
          <Button className="mt-[18px] md:h-[52px]" type="submit">
            수정하기
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getCurrentUser } from "@/lib/api";
import type { ChangeEvent, FormEvent } from "react";

const defaults = getCurrentUser();

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(defaults);
  useEffect(() => {
    const saved = localStorage.getItem("ieoduda-user-profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => setProfile({ ...defaults, ...parsed }));
      } catch {
        localStorage.removeItem("ieoduda-user-profile");
      }
    }
  }, []);
  const change = (e: ChangeEvent<HTMLInputElement>) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("ieoduda-user-profile", JSON.stringify(profile));
    router.push("/profile");
  };
  return (
    <PageContainer
      className="gap-[22px] py-[70px] lg:max-w-none lg:gap-10 lg:px-[140px] lg:pb-[50px] lg:pt-0"
      data-node-id="545:909"
    >
      <PageHeader backHref="/profile" title="변경" />
      <form className="flex flex-col gap-[22px]" onSubmit={submit}>
        <FormField
          id="profile-name"
          label="이름"
          name="name"
          value={profile.name}
          onChange={change}
          placeholder="이름을 입력해 주세요"
        />
        <FormField
          id="profile-email"
          label="이메일"
          name="email"
          type="email"
          value={profile.email}
          onChange={change}
          placeholder="이메일을 입력해 주세요"
        />
        <Button className="mt-[18px] lg:h-[52px]" type="submit">
          변경하기
        </Button>
      </form>
    </PageContainer>
  );
}

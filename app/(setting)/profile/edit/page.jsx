"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const defaultProfile = {
  name: "김나무",
  email: "namu_k@gmail.com",
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem("ieoduda-user-profile");
    let cancelled = false;

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        queueMicrotask(() => {
          if (!cancelled) setProfile({ ...defaultProfile, ...parsedProfile });
        });
      } catch {
        window.localStorage.removeItem("ieoduda-user-profile");
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    window.localStorage.setItem("ieoduda-user-profile", JSON.stringify(profile));
    router.push("/profile");
  }

  return (
    <PageContainer className="gap-[22px] py-[70px]" data-node-id="545:767">
      <PageHeader backHref="/profile" title="변경" />

      <form className="flex w-full flex-col gap-[22px]" onSubmit={handleSubmit}>
        <div className="flex w-full flex-col gap-3.5">
          <label className="text-base font-bold leading-normal" htmlFor="profile-name">이름</label>
          <input
            autoComplete="name"
            className="h-[45px] w-full rounded-[20px] border-0 bg-white px-5 text-sm outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 focus-visible:ring-[#a8a8a8]/50"
            id="profile-name"
            name="name"
            onChange={handleChange}
            placeholder="이름을 입력해 주세요"
            required
            type="text"
            value={profile.name}
          />
        </div>

        <div className="flex w-full flex-col gap-3.5">
          <label className="text-base font-bold leading-normal" htmlFor="profile-email">이메일</label>
          <input
            autoComplete="email"
            className="h-[45px] w-full rounded-[20px] border-0 bg-white px-5 text-sm outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 focus-visible:ring-[#a8a8a8]/50"
            id="profile-email"
            name="email"
            onChange={handleChange}
            placeholder="이메일을 입력해 주세요"
            required
            type="email"
            value={profile.email}
          />
        </div>

        <Button type="submit">변경하기</Button>
      </form>
    </PageContainer>
  );
}

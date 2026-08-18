"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/api";

const defaultProfile = getCurrentUser();

export function UserProfileSummary() {
  const [profile, setProfile] = useState(defaultProfile);
  useEffect(() => {
    const saved = window.localStorage.getItem("ieoduda-user-profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => setProfile({ ...defaultProfile, ...parsed }));
      } catch {
        window.localStorage.removeItem("ieoduda-user-profile");
      }
    }
  }, []);
  return (
    <section className="flex w-full flex-col items-center gap-4 pb-1.5 text-center lg:w-[390px] lg:gap-[22px] lg:pb-1.5 lg:pt-2.5">
      <div
        aria-hidden
        className="size-[104px] rounded-full border-[1.6px] border-[#320c35] bg-[linear-gradient(226deg,#eeecee_40%,#e2dafa_72%)] lg:h-[108px] lg:w-[107px]"
      />
      <div className="flex flex-col items-center gap-2.5 lg:gap-2">
        <h2 className="text-lg font-bold text-[#43306d] lg:text-xl">{profile.name}</h2>
        <p className="text-sm font-semibold text-[#7f62b8] lg:text-[17px]">
          {profile.email}
        </p>
      </div>
      <Link
        className="border-b border-[#796b6c] pb-0.5 text-xs font-medium leading-none text-[#796b6c] lg:text-sm lg:font-normal"
        href="/profile/edit"
      >
        변경하기
      </Link>
    </section>
  );
}

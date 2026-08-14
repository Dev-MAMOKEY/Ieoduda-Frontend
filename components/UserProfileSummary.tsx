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
    <section className="flex w-full flex-col items-center gap-3.5 pb-1.5 pt-2.5 text-center lg:pb-0 lg:pt-0">
      <div aria-hidden className="size-[104px] rounded-full bg-[#d9d9d9]" />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-lg font-bold">{profile.name}</h2>
        <p className="text-[13px] font-medium text-[#838383]">
          {profile.email}
        </p>
      </div>
      <Link
        className="text-xs font-medium text-[#838383] underline"
        href="/profile/edit"
      >
        변경하기
      </Link>
    </section>
  );
}

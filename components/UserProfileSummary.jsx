"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const defaultProfile = {
  name: "김나무",
  email: "namu_k@gmail.com",
};

export function UserProfileSummary() {
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

  return (
    <section className="flex w-full flex-col items-center gap-3.5 pb-1.5 pt-2.5 text-center">
      <div aria-hidden className="size-[104px] rounded-full bg-[#d9d9d9]" />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-lg font-bold leading-normal">{profile.name}</h2>
        <p className="text-[13px] font-medium leading-normal text-[#838383]">{profile.email}</p>
      </div>
      <Link className="text-xs font-medium text-[#838383] underline" href="/profile/edit">
        변경하기
      </Link>
    </section>
  );
}

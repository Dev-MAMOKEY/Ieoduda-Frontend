"use client";

import Link from "next/link";
import { useCurrentUser } from "@/lib/hooks/use-current-user";

export function UserProfileSummary() {
  const { user, loading, error } = useCurrentUser();
  return (
    <section className="flex w-full flex-col items-center gap-4 pb-1.5 text-center lg:w-[390px] lg:gap-[22px] lg:pb-1.5 lg:pt-2.5">
      <div
        aria-hidden
        className="size-[104px] rounded-full border-[1.6px] border-[#320c35] bg-[linear-gradient(226deg,#eeecee_40%,#e2dafa_72%)] lg:h-[108px] lg:w-[107px]"
      />
      <div className="flex flex-col items-center gap-2.5 lg:gap-2">
        <h2 className="text-lg font-bold text-[#43306d] lg:text-xl">{loading ? "불러오는 중" : user?.name ?? "사용자"}</h2>
        <p className="text-sm font-semibold text-[#7f62b8] lg:text-[17px]">
          {error || user?.email || "-"}
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

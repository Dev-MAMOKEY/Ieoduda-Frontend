"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/api/auth";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    if (pending) return;
    setPending(true);

    try {
      // 서버 로그아웃과 Local Storage 토큰 삭제를 함께 처리합니다.
      await logout();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <button
      aria-label="로그아웃"
      className="size-6 shrink-0 disabled:cursor-wait disabled:opacity-50"
      disabled={pending}
      onClick={handleLogout}
      type="button"
    >
      <Image
        alt=""
        height={24}
        src="/icons/plan-home/figma/sign-out.svg"
        width={24}
      />
    </button>
  );
}

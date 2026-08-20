"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { logout } from "@/lib/api/auth";
import { showSnackbarAfterNavigation } from "@/lib/ui/snackbar";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleLogout = async () => {
    if (pending) return;
    setConfirming(false);
    setPending(true);

    try {
      // 서버 로그아웃과 Local Storage 토큰 삭제를 함께 처리합니다.
      await logout();
    } finally {
      showSnackbarAfterNavigation("로그아웃되었습니다.");
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <>
      <button
        aria-label="로그아웃"
        className="size-6 shrink-0 disabled:cursor-wait disabled:opacity-50"
        disabled={pending}
        onClick={() => setConfirming(true)}
        type="button"
      >
        <Image
          alt=""
          height={24}
          src="/icons/plan-home/figma/sign-out.svg"
          width={24}
        />
      </button>
      {confirming ? (
        <ConfirmationDialog
          confirmLabel="로그아웃하기"
          description={<>로그아웃하면 로그인 화면으로 이동해요.<br />작성 중인 내용이 있다면 먼저 저장해 주세요.</>}
          onCancel={() => setConfirming(false)}
          onConfirm={() => void handleLogout()}
          title="로그아웃할까요?"
        />
      ) : null}
    </>
  );
}

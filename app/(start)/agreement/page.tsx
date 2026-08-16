// 사후 인계 필수 동의를 서버에 저장하고 계획 작성 안내로 이동하는 화면입니다.

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DesktopHeader } from "@/components/DesktopHeader";
import { AuthGuard } from "@/components/AuthGuard";
import { getApiErrorMessage } from "@/lib/api/auth";
import { agreeToHandoff } from "@/lib/api/plan";

const agreements = [
  "지정 확인자 2명의 신고가 필요합니다.",
  "외부 법무･장례 파트너가 공식 증빙을 검토 합니다.",
  "승인 후 7-30일의 취소 가능한 기간을 거칩니다.",
  "이메일에는 민감 정보를 넣지 않고 발송합니다.",
  "서비스가 실제 계정을 자동 삭제･이전하지 않습니다.",
];

export default function AgreementPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 중복 제출을 막고 동의가 저장된 뒤에만 다음 화면으로 이동합니다.
  const handleAgree = async () => {
    if (pending) return;
    setPending(true);
    setErrorMessage("");
    try {
      await agreeToHandoff();
      router.replace("/plan-info");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "동의 처리에 실패했습니다."));
      setPending(false);
    }
  };

  return (
    <AuthGuard>
      <main
        className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center justify-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e] md:max-w-none md:flex-col md:p-0"
        data-node-id="439:1176"
      >
      <DesktopHeader authenticated />
      <div className="flex w-full flex-1 items-center justify-center md:px-[140px] md:py-[50px]">
        <Card data-node-id="439:1177" variant="agreement">
          <h1 className="w-full text-center text-base font-bold leading-normal">
            사후 인계 안내 필수 동의
          </h1>

          <ul className="flex w-full flex-col gap-5">
            {agreements.map((agreement) => (
              <li
                className="flex items-center gap-3 text-[13px] font-medium leading-normal text-[#838383]"
                key={agreement}
              >
                <Image
                  alt=""
                  aria-hidden="true"
                  className="size-[10px] shrink-0"
                  height={10}
                  src="/images/agreement/bullet.svg"
                  width={10}
                />
                <span className="whitespace-nowrap">{agreement}</span>
              </li>
            ))}
          </ul>

          {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
          <Button disabled={pending} onClick={handleAgree} type="button">
            {pending ? "처리 중..." : "동의 후 시작하기"}
          </Button>
        </Card>
      </div>
      </main>
    </AuthGuard>
  );
}

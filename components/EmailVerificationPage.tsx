"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { getApiErrorMessage } from "@/lib/api/auth";

type EmailVerificationPageProps = {
  title: string;
  heading: string;
  description: string;
  successMessage: string;
  verify: (token: string) => Promise<unknown>;
};

export function EmailVerificationPage({
  title,
  heading,
  description,
  successMessage,
  verify,
}: EmailVerificationPageProps) {
  const [pending, setPending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    if (!token) {
      setMessage("유효한 이메일 검증 토큰이 필요합니다.");
      return;
    }

    setPending(true);
    setMessage("");
    try {
      await verify(token);
      setVerified(true);
      setMessage(successMessage);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "이메일을 확인하지 못했습니다."));
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-dvh text-[#43306d]">
      <header className="hidden h-[125px] items-center px-[120px] lg:flex">
        <BrandLogo />
      </header>

      <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
        <header className="mb-[22px] flex w-full items-center justify-center py-2 lg:mb-0 lg:py-0">
          <h1 className="text-lg font-bold leading-none lg:text-xl">{title}</h1>
        </header>

        <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-10">
          <article className="flex w-full flex-col items-center gap-6 rounded-[18px] bg-[#fbfafd] px-5 py-9 text-center lg:gap-7 lg:rounded-[30px] lg:px-8">
            <Image alt="" className="size-7 lg:size-8" height={32} src="/icons/email/envelope-open.svg" width={32} />
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-lg font-bold leading-normal lg:text-xl">{heading}</h2>
              <p className="whitespace-pre-line text-[13px] font-medium leading-relaxed text-[#584e4d] lg:text-[15px]">
                {description}
              </p>
            </div>

            <Button disabled={pending || verified} onClick={() => void handleVerify()} type="button">
              {pending ? "확인 중..." : verified ? "확인 완료" : "이메일 확인하기"}
            </Button>
            {message ? (
              <p className={`text-sm font-medium ${verified ? "text-[#43306d]" : "text-red-600"}`} role={verified ? "status" : "alert"}>
                {message}
              </p>
            ) : null}
          </article>

          <footer className="flex flex-col items-center gap-3 text-center text-xs leading-normal text-[#796b6c] lg:text-sm">
            <p>이어두다는 이 링크에서 비밀번호나 결제 정보를 요구하지 않아요.</p>
            <p>
              궁금한 점은 문의해 주세요.{" "}
              <Link className="text-[#584e4d] underline underline-offset-2" href="mailto:support@ieoduda.com">문의하기</Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}

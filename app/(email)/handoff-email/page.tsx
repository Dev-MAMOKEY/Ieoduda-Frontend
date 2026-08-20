// 사후 인계 이메일 화면
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ActionFeedback } from "@/components/ActionFeedback";
import { getPosthumousAccess, sendPosthumousOtp, verifyPosthumousOtp } from "@/lib/api/public";
import type { PosthumousAccessResponse } from "@/lib/api/public-types";

function ActionButton({ children, disabled, href, onClick, secondary = false }: { children: string; disabled?: boolean; href?: string; onClick?: () => void; secondary?: boolean }) {
  const className = `flex min-h-11 w-full items-center justify-center rounded-[14px] px-5 py-3.5 text-sm font-medium leading-normal text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] lg:min-h-12 lg:text-base ${secondary ? "bg-[#7f62b8] hover:bg-[#7055a4]" : "bg-[#43306d] hover:bg-[#332452] lg:bg-[#3c2b62]"}`;
  return href ? <Link className={className} href={href}>{children}</Link> : <button className={className} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}

function VerificationCode({ code, onChange }: { code: string[]; onChange: (index: number, value: string) => void }) {
  return <section className="flex w-[302px] flex-col items-center gap-4 rounded-[16px] bg-[#eeecee] px-5 py-[18px] lg:rounded-[20px] lg:p-5">
    <h3 className="text-sm font-bold leading-none lg:text-base">인증 코드 입력</h3>
    <div className="flex gap-3">
      {Array.from({ length: 4 }, (_, index) => <input
        aria-label={`인증 코드 ${index + 1}번째 자리`}
        className="size-[38px] rounded-xl border-0 bg-[#fbfafd] text-center text-base font-bold text-[#43306d] outline-none focus-visible:ring-2 focus-visible:ring-[#43306d]/25"
        inputMode="numeric"
        key={index}
        maxLength={1}
        onChange={(event) => onChange(index, event.target.value.replace(/\D/g, ""))}
        value={code[index]}
      />)}
    </div>
    <p className="text-xs leading-none text-[#584e4d] lg:text-sm">코드가 안 보이면 스팸함도 확인해 주세요</p>
  </section>;
}

export default function HandoffEmailPage() {
  const router = useRouter();
  const [access, setAccess] = useState<PosthumousAccessResponse | null>(null);
  const [code, setCode] = useState(["", "", "", ""]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [maskedRecipientEmail, setMaskedRecipientEmail] = useState("");
  const accessLoaded = useRef(false);
  const requestInFlight = useRef(false);
  const token = () => new URLSearchParams(window.location.search).get("token") ?? "";
  useEffect(() => { if (accessLoaded.current) return; accessLoaded.current = true; const value = token(); if (!value) { queueMicrotask(() => setError("유효한 인계 토큰이 필요합니다.")); return; } getPosthumousAccess(value).then(setAccess).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "인계 정보를 불러오지 못했습니다.")); }, []);
  const sendOtp = async () => { const value = token(); if (!value || requestInFlight.current) return; requestInFlight.current = true; setPending(true); setError(""); setOtpMessage(""); try { const result = await sendPosthumousOtp(value); setMaskedRecipientEmail(result.maskedEmail); setOtpMessage("인증번호를 발송했습니다. 이메일을 확인해 주세요."); } catch (reason) { setError(reason instanceof Error ? reason.message : "인증번호를 발송하지 못했습니다."); } finally { requestInFlight.current = false; setPending(false); } };
  const verify = async () => { const value = token(); if (!value || requestInFlight.current) return; requestInFlight.current = true; setPending(true); try { const result = await verifyPosthumousOtp(value, code.join("")); router.push("/package?accessSessionId=" + encodeURIComponent(result.accessSessionId)); } catch (reason) { setError(reason instanceof Error ? reason.message : "인증번호를 확인하지 못했습니다."); } finally { requestInFlight.current = false; setPending(false); } };
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex"><BrandLogo /></header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <header className="mb-5 flex w-full items-center justify-center py-2 lg:mb-0">
        <h1 className="text-lg font-bold leading-none lg:text-xl">사후 인계 이메일</h1>
      </header>

      <div className="flex w-full flex-col gap-5 lg:mt-[50px] lg:w-[460px] lg:gap-10">
        <article className="flex w-full flex-col items-center gap-[23px] overflow-hidden rounded-[18px] bg-[#fbfafd] px-5 py-9 text-center lg:gap-7 lg:rounded-[30px] lg:pb-[34px] lg:pt-9">
          <header className="flex flex-col items-center gap-3 lg:gap-3.5">
            <p className="text-sm font-bold leading-none text-[#584e4d] lg:text-base lg:text-[#796b6c]">{access?.recipientName ?? "담당자"}님에게</p>
            <Image alt="" className="size-6 lg:size-[26px]" height={26} src="/icons/email/handoff-envelope-open.svg" width={26} />
            <div className="flex flex-col items-center gap-1.5 text-lg font-bold leading-none lg:text-xl">
              <p>{access?.authorName ?? "작성자"}님의</p>
              <p className="lg:hidden">사후 인계 안내 드려요</p>
              <p className="hidden lg:block">사후 인계 안내 드려요</p>
            </div>
          </header>

          <h2 className="text-base font-bold leading-none lg:text-lg">관계 정리 담당자</h2>

          <div className="flex flex-col items-center gap-2 text-[13px] font-medium leading-none text-[#838383] lg:block lg:text-[15px] lg:leading-normal lg:text-[#584e4d]">
            <p>인증하시면 인계 내용을 볼 수 있어요.</p>
            <p>그 전까지는 안전하게 보호되어 있어요.</p>
          </div>

          <ActionButton disabled={pending || !access} onClick={() => void sendOtp()}>인증번호 발송하기</ActionButton>
          {otpMessage ? <ActionFeedback tone="success">{otpMessage}</ActionFeedback> : null}
          <VerificationCode code={code} onChange={(index, value) => setCode((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} />

          <button className="text-xs leading-none underline underline-offset-2 lg:text-sm lg:font-semibold lg:text-[#28292e]" disabled={pending} onClick={() => void sendOtp()} type="button">코드 재발송</button>

          <p className="text-xs font-medium leading-normal text-[#796b6c] lg:text-[15px] lg:text-[#584e4d]">
            <span>{maskedRecipientEmail ? `${maskedRecipientEmail}로 인증 코드를 보냈어요.` : "인증번호를 발송하면 수신 이메일을 확인할 수 있어요."}</span>
          </p>

          <ActionButton disabled={pending || code.some((digit) => !digit)} onClick={() => void verify()} secondary>이메일 링크 열기</ActionButton>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </article>

        <aside className="flex w-full flex-col items-start rounded-[16px] bg-[#f3f3ff] px-5 pb-[22px] pt-[18px] lg:rounded-[20px]">
          <div className="flex flex-col gap-2 lg:gap-2.5">
            <Image alt="" className="size-[22px]" height={22} src="/icons/email/handoff-warning-circle.svg" width={22} />
            <h2 className="text-sm font-bold leading-none lg:text-base">피싱 방지 안내</h2>
          </div>
          <div className="mt-2.5 flex flex-col gap-1.5 text-xs leading-none text-[#796b6c] lg:mt-[13px] lg:gap-2 lg:text-sm">
            <p>이어두다는 비밀번호·결제 정보를 절대 묻지 않아요.</p>
            <p>이 코드를 누구와도 공유하지 마세요.</p>
          </div>
        </aside>
      </div>
    </section>
  </main>;
}

// 사망 신고 이메일 화면
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { getApiErrorMessage } from "@/lib/api/auth";
import { reportDeath } from "@/lib/api/public";
import { useConfirmerInvitation } from "@/lib/hooks/use-invitation";

const dateFields = [
  { label: "년도", type: "number", min: 1900, max: 9999 },
  { label: "월", type: "number", min: 1, max: 12 },
  { label: "일", type: "number", min: 1, max: 31 },
] as const;

function getValidDeathDate(date: string[]) {
  if (date.every((part) => !part)) throw new Error("사망하신 날짜를 입력하거나 정확한 날짜를 모른다고 선택해 주세요.");
  if (date.some((part) => !part)) throw new Error("사망 날짜는 연도, 월, 일을 모두 입력해 주세요.");

  const [year, month, day] = date.map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const isValid = parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
  if (!isValid) throw new Error("실제로 존재하는 날짜를 입력해 주세요.");
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function DeathReportPage() {
  const router = useRouter();
  const { invitation } = useConfirmerInvitation();
  const [date, setDate] = useState(["", "", ""]);
  const [unknownDate, setUnknownDate] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [dateError, setDateError] = useState("");
  const requestInFlight = useRef(false);
  const ownerName = invitation?.ownerName ?? "계획 작성자";
  const submit = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token") ?? "";
    if (!token) return setError("유효한 신고 토큰이 필요합니다.");
    let deathDate: string | undefined;
    try {
      deathDate = unknownDate ? undefined : getValidDeathDate(date);
      setDateError("");
    } catch (reason) {
      setDateError(reason instanceof Error ? reason.message : "사망하신 날짜를 확인해 주세요.");
      return;
    }
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setPending(true);
    setError("");
    try {
      const result = await reportDeath(token, deathDate);
      const params = new URLSearchParams();
      params.set("token", result.evidenceUploadToken);
      params.set("caseId", result.caseId);
      router.push("/evidence-submit?" + params.toString());
    } catch (reason) {
      setError(getApiErrorMessage(reason, "신고를 처리하지 못했습니다."));
    } finally { requestInFlight.current = false; setPending(false); }
  };
  return (
    <main className="min-h-dvh text-[#43306d]">
      <header className="hidden h-[125px] items-center px-[120px] lg:flex">
        <BrandLogo />
      </header>

      <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-20 lg:pt-0">
        <header className="mb-[22px] flex h-10 w-full items-center justify-center lg:mb-0 lg:h-auto">
          <h1 className="sr-only lg:not-sr-only lg:text-xl lg:font-bold lg:leading-none">사망 신고 이메일</h1>
        </header>

        <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-10">
          <div className="flex flex-col gap-[22px] lg:gap-9">
            <article className="flex w-full flex-col items-center gap-6 overflow-hidden rounded-[18px] bg-[#fbfafd] px-5 py-9 text-center lg:gap-7 lg:rounded-[30px] lg:pb-[34px] lg:pt-9">
              <header className="flex flex-col items-center gap-3 lg:gap-3.5">
                <p className="text-sm font-bold leading-none text-[#584e4d] lg:text-base lg:text-[#796b6c]">{invitation?.confirmerName ?? "확인자"}님에게</p>
                <Image alt="" className="size-6 lg:size-[26px]" height={26} src="/icons/email/envelope-open.svg" width={26} />
                <div className="flex flex-col items-center gap-1.5 text-lg font-bold leading-none lg:flex-row lg:gap-1.5 lg:text-xl">
                  <p>{ownerName}님에 대한</p>
                  <p>확인이 필요해요</p>
                </div>
              </header>

              <p className="text-[13px] font-medium leading-none lg:text-[15px] lg:text-[#584e4d]">
                {ownerName}님이 생전에 당신을 확인자로 지정하셨어요.
              </p>

              <div className="flex w-full flex-col items-center gap-3.5">
                <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">아래에 쓰여진 정보를 확인해 주세요.</p>
                <div className="flex w-full flex-col items-center justify-center gap-1.5 rounded-[14px] bg-[#f3f3ff] px-5 py-[18px] lg:w-auto lg:flex-row lg:gap-3 lg:rounded-[20px] lg:bg-[#eeecee] lg:px-10 lg:py-[22px]">
                  <strong className="text-base leading-none">{ownerName}</strong>
                  <span className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{invitation?.contactEmail ?? "연락처 확인 중"}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1.5 text-xs font-medium leading-none text-[#584e4d] lg:block lg:text-[15px] lg:leading-normal">
                <p>당신의 신고는 준비된 절차를 시작할 뿐이에요.</p>
                <p>대기 기간과 본인 확인을 거치기 때문에,</p>
                <p>지금 이 버튼이 무언가를 즉시 실행하거나 지우지 않아요.</p>
              </div>
            </article>

            <section className="flex flex-col gap-[18px] py-2.5 lg:gap-[18px] lg:py-0">
              <div className="flex flex-col gap-2 lg:gap-1.5">
                <h2 className="text-base font-bold leading-none lg:text-lg">사망하신 날짜</h2>
                <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">날짜를 아는 경우에만 입력해 주세요</p>
              </div>

              <div className="flex gap-2.5 lg:flex-col lg:gap-4">
                {dateFields.map((field, index) => (
                  <input
                    aria-label={field.label}
                    className="min-h-11 min-w-0 flex-1 rounded-[14px] border-0 bg-[#fbfafd] px-3 py-3.5 text-center text-[13px] font-medium leading-none text-[#584e4d] outline-none placeholder:text-[#796b6c] focus-visible:ring-2 focus-visible:ring-[#43306d]/25 lg:min-h-[48px] lg:w-full lg:flex-none lg:rounded-[20px] lg:px-5 lg:py-4"
                    key={field.label}
                    max={field.max}
                    min={field.min}
                    disabled={unknownDate}
                    onChange={(event) => { setDate((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value)); setDateError(""); }}
                    placeholder={field.label}
                    type={field.type}
                    value={date[index]}
                  />
                ))}
              </div>

              <label className="flex items-center gap-3.5 p-2.5 text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">
                <span className="relative flex size-4 shrink-0 items-center justify-center lg:size-[18px]">
                  <input
                    className="peer size-full cursor-pointer appearance-none rounded-full border border-[#584e4d] bg-transparent checked:border-[#43306d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d]"
                    checked={unknownDate}
                    onChange={(event) => { setUnknownDate(event.target.checked); setDateError(""); }}
                    type="checkbox"
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
                    <Image alt="" className="size-3" height={12} src="/icons/agreement/check.svg" width={12} />
                  </span>
                </span>
                정확한 날짜를 모르겠어요.
              </label>
              {dateError ? <p className="px-2.5 text-xs font-medium text-red-600" role="alert">{dateError}</p> : null}
            </section>

            <aside className="flex flex-col items-start rounded-[16px] bg-[#f3f3ff] px-5 pb-[22px] pt-[18px] lg:rounded-[20px] lg:px-[22px]">
              <div className="flex flex-col items-start gap-2.5">
                <Image alt="" className="size-[22px]" height={22} src="/icons/email/handoff-warning-circle.svg" width={22} />
                <h2 className="text-sm font-bold leading-none lg:text-base">허위 신고 경고 안내</h2>
                <p className="text-xs font-medium leading-normal text-[#796b6c] lg:text-sm lg:text-[#584e4d]">
                  사실이 아닌 신고는 다른 사람의 삶에 돌이킬 수 없는 영향을 줄 수 있어요. 모든 신고는 기록되며, 허위 신고에는 책임이 따를 수 있어요.
                </p>
              </div>
            </aside>
          </div>

          <div className="py-3 lg:py-0">
            <Button disabled={pending} onClick={() => void submit()} type="button">{pending ? "처리 중..." : "사망 사실 신고하기"}</Button>
            {error ? <p className="mt-3 text-center text-sm text-red-600">{error}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

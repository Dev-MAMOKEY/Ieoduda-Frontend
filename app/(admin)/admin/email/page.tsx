"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AdminAuditTabs } from "@/components/AdminAuditTabs";
import { ActionFeedback } from "@/components/ActionFeedback";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { freezeReleaseCase, getEmailAudit, retryEmailDelivery } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api/auth";

type EmailAudit = Awaited<ReturnType<typeof getEmailAudit>>;
type EmailRecipient = EmailAudit["recipients"][number];

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(4, name.length - 2))}@${domain}`;
}

function RecipientCard({ person }: { person: EmailRecipient }) {
  return <article className="flex w-full flex-col gap-[30px] rounded-[20px] bg-[#fbfafd] px-5 py-[22px]">
    <header className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-[11px]">
        <h2 className="text-base font-bold leading-none text-[#43306d] lg:text-lg">{person.role}</h2>
        <div className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold leading-none text-[#796b6c] lg:gap-3 lg:text-[15px] lg:font-medium">
          <span>{person.name}</span>
          <span>{maskEmail(person.email)}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1.5 lg:gap-2.5">
        <span className="whitespace-nowrap text-[13px] font-medium leading-none text-[#796b6c] lg:text-[15px]">
          {person.warning ? "반송" : "발송됨"}
        </span>
        {person.warning && <Image alt="" className="size-[18px] lg:size-5" height={20} src="/icons/plan/cards/warning.svg" width={20} />}
      </div>
    </header>

    <div className="flex w-full items-start gap-4 lg:justify-between lg:gap-2 lg:pr-[30px]">
      {person.events.map(([, time], index) => <div className="flex shrink-0 items-center gap-1.5 lg:gap-2" key={`${index}-${time}`}>
        <strong className="text-sm leading-none text-[#43306d] lg:text-base">{["발송", "열람", "완료"][index]}</strong>
        <span className="text-xs font-semibold leading-none text-[#796b6c] lg:text-sm">{time}</span>
      </div>)}
    </div>
  </article>;
}

export default function EmailPage() {
  const [audit, setAudit] = useState<EmailAudit>({ totalCount: 0, summary: ["발송 0", "반송 0"], recipients: [] });
  const [caseId, setCaseId] = useState("");
  const [caseIdError, setCaseIdError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [freezePending, setFreezePending] = useState(false);
  const [freezeMessage, setFreezeMessage] = useState("");
  const [freezeError, setFreezeError] = useState(false);
  const load = useCallback(async (nextCaseId: string) => {
    try {
      setAudit(await getEmailAudit(nextCaseId));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "이메일 감사를 불러오지 못했습니다.");
    }
  }, []);
  useEffect(() => {
    const nextCaseId = new URLSearchParams(window.location.search).get("caseId") ?? "";
    queueMicrotask(() => setCaseId(nextCaseId));
    if (nextCaseId) queueMicrotask(() => void load(nextCaseId));
  }, [load]);
  const searchCase = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextCaseId = caseId.trim();

    if (!nextCaseId) {
      setCaseIdError("조회할 사건 ID를 입력해 주세요.");
      return;
    }

    setCaseIdError("");
    setCaseId(nextCaseId);
    const url = new URL(window.location.href);
    url.searchParams.set("caseId", nextCaseId);
    window.history.replaceState(null, "", url);
    await load(nextCaseId);
  };
  const retryFailed = async () => {
    await Promise.all(audit.recipients.filter((item) => item.warning).map((item) => retryEmailDelivery(caseId, item.id)));
    await load(caseId);
  };
  const freezeCase = async () => {
    const nextCaseId = caseId.trim();
    if (!nextCaseId || freezePending) return;

    setFreezePending(true);
    setFreezeMessage("");
    setFreezeError(false);
    try {
      await freezeReleaseCase(nextCaseId);
      setFreezeMessage("사건을 동결했습니다.");
    } catch (error) {
      setFreezeError(true);
      setFreezeMessage(getApiErrorMessage(error, "사건을 동결하지 못했습니다."));
    } finally {
      setFreezePending(false);
    }
  };

  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] grid-cols-3 items-center px-[120px] lg:grid">
      <BrandLogo />
      <AdminAuditTabs active="email" desktop />
      <span />
    </header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-20 lg:pt-0">
      <header className="mb-[22px] flex w-full items-center justify-center py-2 lg:hidden">
        <h1 className="text-lg font-bold leading-none">이메일 발송 감사</h1>
      </header>
      <AdminAuditTabs active="email" />
      <h1 className="mt-2.5 hidden text-xl font-bold leading-none lg:block">이메일 발송 감사</h1>

      <div className="mt-7 flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px]">
        <form className="flex w-full flex-col gap-3" onSubmit={searchCase}>
          <FormField
            autoComplete="off"
            error={caseIdError}
            id="email-audit-case-id"
            label="사건 ID"
            name="caseId"
            onChange={(event) => {
              setCaseId(event.currentTarget.value);
              setCaseIdError("");
            }}
            placeholder="조회할 사건 ID를 입력해 주세요"
            value={caseId}
          />
          <Button type="submit">이메일 발송 감사 조회하기</Button>
        </form>
        {errorMessage && <p className="text-center text-sm text-red-700" role="alert">{errorMessage}</p>}
        <section className="flex flex-col gap-3.5">
          <h2 className="text-base font-bold leading-none lg:text-lg">수신자 총 {audit.totalCount}명</h2>
          <div className="flex gap-2.5">
            {audit.summary.map((item) => (
              <span className="rounded-[14px] bg-[#fbfafd] px-4 py-2.5 text-[13px] font-medium leading-none lg:rounded-[30px] lg:px-5 lg:py-3 lg:text-[15px]" key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>

        {audit.recipients.map((person) => <RecipientCard key={person.email} person={person} />)}

        <div className="flex flex-col items-center gap-1.5 pb-2.5 text-center text-xs font-medium leading-none text-[#796b6c] lg:gap-2 lg:pb-0 lg:pt-2.5 lg:text-sm lg:font-normal">
          <p>전달 상태만 조회가 가능해요.</p>
          <p>이메일 본문·패키지 내용에는 접근할 수 없어요.</p>
        </div>

        <div className="flex flex-col gap-6 lg:gap-[22px] lg:pt-5">
          <Button disabled={!caseId || !audit.recipients.some((item) => item.warning)} onClick={retryFailed} type="button">재시도 정책 실행하기</Button>
          <div className="grid grid-cols-2 gap-[22px] lg:grid-cols-1">
            <button className="flex min-h-11 items-center justify-center rounded-[14px] bg-[#7f62b8] px-5 py-3.5 text-sm font-medium leading-none text-[#fbfafd] transition-colors enabled:hover:bg-[#7055a4] disabled:cursor-not-allowed disabled:opacity-60 lg:text-base" disabled={!caseId.trim() || freezePending} onClick={() => void freezeCase()} type="button">{freezePending ? "사건 동결 중..." : "사건 동결하기"}</button>
            <button className="flex min-h-11 items-center justify-center rounded-[14px] bg-[#e2dafa] px-5 py-3.5 text-sm font-medium leading-none text-[#43306d] transition-colors hover:bg-[#d6caef] lg:text-base" type="button">파트너 문의하기</button>
          </div>
          {freezeMessage ? <ActionFeedback tone={freezeError ? "error" : "success"}>{freezeMessage}</ActionFeedback> : null}
        </div>
      </div>
    </section>
  </main>;
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AdminAuditTabs } from "@/components/AdminAuditTabs";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { getEvidenceAuditRecords, retryEvidenceDeletion } from "@/lib/api";

type EvidenceRecord = Awaited<ReturnType<typeof getEvidenceAuditRecords>>[number];
const stages = ["검토 완료", "삭제 예정", "실제 삭제"];

function Timeline({ dates }: { dates: string[] }) {
  return <div className="flex w-full flex-col items-center gap-[5px] lg:gap-5">
    {stages.map((stage, index) => <div className="contents" key={stage}>
      <div className="flex w-full items-start justify-between rounded-[14px] bg-[#eeecee] px-5 py-4 lg:flex-col lg:gap-2 lg:rounded-[20px]">
        <strong className="text-sm leading-none text-[#43306d] lg:text-base">{stage}</strong>
        <span className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{dates[index]}</span>
      </div>
      {index < stages.length - 1 && <Image alt="" className="size-4 rotate-90 lg:size-5" height={20} src="/icons/common/caret-right.svg" width={20} />}
    </div>)}
  </div>;
}

function EvidenceCard({ record }: { record: EvidenceRecord }) {
  const [copied, setCopied] = useState(false);
  async function copyHash() {
    await navigator.clipboard?.writeText(record.fullHash ?? "");
    setCopied(true);
  }

  return <article className="flex w-full flex-col gap-[22px] rounded-[18px] bg-[#fbfafd] px-5 pb-5 pt-6 lg:rounded-[20px] lg:p-5">
    <header className="flex items-start justify-between gap-4">
      <h2 className="text-base font-bold leading-none text-[#43306d] lg:text-lg">{record.title}</h2>
      <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
        <strong className="text-sm leading-none text-[#796b6c] lg:text-base">{record.status}</strong>
        {record.failed && <Image alt="" className="size-[18px] lg:size-5" height={20} src="/icons/plan/cards/warning.svg" width={20} />}
      </div>
    </header>
    <Timeline dates={record.dates} />
    {record.failed ? <div className="flex items-center justify-between rounded-[14px] bg-[#f3f3ff] px-5 py-4 lg:rounded-[20px]">
      <div className="flex flex-col gap-2 lg:gap-2.5">
        <strong className="text-sm leading-none text-[#43306d] lg:text-base">실패 사유</strong>
        <span className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{record.failureReason}</span>
      </div>
      <Image alt="" className="size-[21px]" height={21} src="/icons/inspection/x-circle.svg" width={21} />
    </div> : <div className="flex items-center justify-between rounded-[14px] bg-[#f3f3ff] px-5 py-4 lg:rounded-[20px]">
      <div className="flex min-w-0 flex-col gap-2.5">
        <div className="flex items-center gap-1.5">
          <strong className="text-sm leading-none text-[#43306d] lg:text-base">무결성 해시</strong>
          <span className="text-xs font-medium leading-none text-[#584e4d] lg:text-sm">SHA-256</span>
        </div>
        <span className="truncate text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{record.hash}</span>
      </div>
      <button className="shrink-0 text-xs leading-none text-[#584e4d] underline underline-offset-2 lg:text-sm" onClick={copyHash} type="button">{copied ? "복사 완료" : "복사하기"}</button>
    </div>}
  </article>;
}

export default function EvidencePage() {
  const [records, setRecords] = useState<EvidenceRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const load = useCallback(async () => {
    try {
      setRecords(await getEvidenceAuditRecords());
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "증빙 삭제 감사를 불러오지 못했습니다.");
    }
  }, []);
  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);
  const retryFailed = async () => {
    await Promise.all(records.filter((record) => record.failed).map((record) => retryEvidenceDeletion(record.evidenceId)));
    await load();
  };
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] grid-cols-3 items-center px-[120px] lg:grid">
      <BrandLogo />
      <AdminAuditTabs active="evidence" desktop />
      <span />
    </header>
    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <header className="mb-5 flex w-full items-center justify-center py-2 lg:hidden">
        <h1 className="text-lg font-bold leading-none">증빙 삭제 감사</h1>
      </header>
      <AdminAuditTabs active="evidence" />
      <h1 className="mt-2.5 hidden text-xl font-bold leading-none lg:block">증빙 삭제 감사</h1>
      <div className="mt-7 flex w-full flex-col gap-7 lg:mt-[50px] lg:w-[460px] lg:gap-[22px]">
        {errorMessage && <p className="text-center text-sm text-red-700" role="alert">{errorMessage}</p>}
        {records.map((record) => <EvidenceCard key={record.title} record={record} />)}
        <p className="py-2.5 text-center text-xs leading-none text-[#796b6c] lg:py-3.5 lg:text-sm">삭제된 원본은 어떤 형태로도 미리보기 및 복원되지 않아요</p>
        <Button disabled={!records.some((record) => record.failed)} onClick={retryFailed} type="button">재처리 요청하기</Button>
      </div>
    </section>
  </main>;
}

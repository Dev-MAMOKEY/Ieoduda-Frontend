"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AdminAuditTabs } from "@/components/AdminAuditTabs";
import { getEvidenceAuditRecords } from "@/lib/api";

type EvidenceRecord = ReturnType<typeof getEvidenceAuditRecords>[number];
const button =
  "h-[45px] rounded-[20px] border-0 bg-[#a8a8a8] text-sm text-white transition-all duration-200 hover:bg-[#929292] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383] active:scale-[0.985] lg:h-[47px] lg:rounded-[30px] lg:text-[15px]";
function Timeline({ dates }: { dates: string[] }) {
  const stages = ["검토 완료", "삭제 예정", "실제 삭제"];
  return (
    <div className="flex gap-1 lg:gap-5">
      {stages.map((stage, i) => (
        <div className="contents" key={stage}>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-[20px] bg-[#f0f0f2] px-3 py-4 lg:px-5">
            <strong className="whitespace-nowrap text-xs lg:text-sm">
              {stage}
            </strong>
            <span className="text-xs text-[#838383] lg:text-sm">
              {dates[i]}
            </span>
          </div>
          {i < 2 && (
            <Image
              alt=""
              className="size-4 lg:size-[18px]"
              width={18}
              height={18}
              src="/icons/common/caret-right.svg"
            />
          )}
        </div>
      ))}
    </div>
  );
}
function Card({ record, selected, onSelect }: { record: EvidenceRecord; selected: boolean; onSelect: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <article
      aria-selected={selected}
      className={`flex cursor-pointer flex-col gap-[22px] rounded-[20px] border-solid bg-white p-5 outline-none transition-all duration-200 ${selected ? "border-[1.6px] border-[#838383] shadow-[0_4px_16px_rgba(40,41,46,.1)]" : record.failed ? "border-[1.2px] border-[#a8a8a8]" : "border-[1.6px] border-transparent hover:border-[#d9d9d9]"}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="option"
      tabIndex={0}
    >
      <div className="flex justify-between">
        <h2 className="text-sm font-bold lg:text-base">{record.title}</h2>
        <span className="flex gap-1 text-[13px] text-[#838383] lg:text-[15px]">
          {record.status}
          {record.failed && (
            <Image
              alt=""
              width={18}
              height={18}
              src="/icons/plan/cards/warning.svg"
            />
          )}
        </span>
      </div>
      <Timeline dates={record.dates} />
      {record.failed ? (
        <div className="flex items-center justify-between rounded-[20px] bg-[#f0f0f2] p-5">
          <span className="flex flex-col gap-1.5">
            <strong className="text-xs lg:text-sm">실패 사유</strong>
            <span className="text-xs text-[#838383] lg:text-sm">
              {record.failureReason}
            </span>
          </span>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f0f0f2]">
            <Image
              alt=""
              className="size-[18px] opacity-80"
              width={18}
              height={18}
              src="/icons/inspection/x-circle.svg"
            />
          </span>
        </div>
      ) : (
        <div className="flex justify-between rounded-[20px] bg-[#d9d9d9] p-5">
          <span className="flex flex-col gap-2">
            <span className="flex gap-1.5">
              <strong className="text-xs lg:text-sm">무결성 해시</strong>
              <span className="text-xs text-[#838383] lg:text-sm">SHA-256</span>
            </span>
            <span className="text-xs text-[#838383] lg:text-sm">
              {record.hash}
            </span>
          </span>
          <button
            className="text-xs text-[#838383] underline lg:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard?.writeText(record.fullHash ?? "");
              setCopied(true);
            }}
            type="button"
          >
            {copied ? "복사 완료" : "복사하기"}
          </button>
        </div>
      )}
    </article>
  );
}
export default function EvidencePage() {
  const records = getEvidenceAuditRecords();
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <main className="min-h-dvh bg-[#f0f0f2] px-6 py-[70px] text-[#28292e] lg:px-0 lg:py-0">
      <header className="hidden h-[125px] grid-cols-3 items-center px-[50px] lg:grid">
        <Link className="p-2 text-[22px] font-semibold" href="/">
          이어두다
        </Link>
        <AdminAuditTabs active="evidence" desktop />
        <span />
      </header>
      <div className="mx-auto flex max-w-[390px] flex-col gap-[22px] lg:max-w-none lg:gap-0">
        <header className="grid grid-cols-[24px_1fr_24px] pb-5 lg:flex lg:justify-center lg:pb-0">
          <span />
          <h1 className="text-center text-lg font-bold lg:text-xl">
            증빙 삭제 감사
          </h1>
          <span />
        </header>
        <AdminAuditTabs active="evidence" />
        <div
          className="flex flex-col gap-[22px] lg:px-[120px] lg:py-[50px]"
          role="listbox"
        >
          {records.map((r) => (
            <Card
              key={r.title}
              record={r}
              selected={selected === r.title}
              onSelect={() => setSelected(r.title)}
            />
          ))}
          <p className="py-2.5 text-center text-xs text-[#838383] lg:text-sm">
            삭제된 원본은 어떤 형태로도 미리보기 및 복원되지 않아요
          </p>
          <button className={button} type="button">
            재처리 요청하기
          </button>
        </div>
      </div>
    </main>
  );
}

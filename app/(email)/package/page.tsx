"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { completePackageAction, getPosthumousPackage, reportPackageIssue } from "@/lib/api/public";
import type { PackageActionResponse, PosthumousPackageResponse } from "@/lib/api/public-types";

function ActionButton({ children, disabled, onClick, secondary = false }: { children: string; disabled?: boolean; onClick: () => void; secondary?: boolean }) {
  return <button className={`flex min-h-[45px] w-full items-center justify-center rounded-[14px] px-5 py-[14px] text-sm font-medium leading-none text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] disabled:cursor-not-allowed disabled:opacity-60 lg:min-h-12 lg:text-base ${secondary ? "bg-[#7f62b8] enabled:hover:bg-[#6f54a5]" : "bg-[#43306d] enabled:hover:bg-[#332452] lg:bg-[#3c2b62]"}`} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}

function TaskItem({ action, emphasized }: { action: PackageActionResponse; emphasized: boolean }) {
  return <div className={`flex min-w-0 flex-1 flex-col items-start gap-2.5 rounded-[14px] px-5 py-[18px] lg:w-full lg:flex-none lg:gap-3.5 lg:rounded-[20px] ${emphasized ? "border-[1.2px] border-[#7f62b8] bg-[#f3f3ff] lg:border-[1.4px]" : "bg-[#eeecee]"}`}>
    <Image alt="" className="size-5 shrink-0 lg:size-[22px]" height={22} src={emphasized ? "/icons/inspection/check-circle.svg" : "/icons/inspection/x-circle.svg"} width={22} />
    <div className="flex min-w-0 w-full flex-col gap-1.5 lg:gap-2">
      <h4 className="break-words text-sm font-bold leading-normal lg:text-base">{action.targetName ?? action.action}</h4>
      <p className="whitespace-pre-wrap break-words text-[13px] font-medium leading-normal text-[#584e4d] lg:text-[15px]">{action.content}</p>
    </div>
  </div>;
}

function ActionCard({ action, active }: { action: PackageActionResponse; active: boolean }) {
  const completed = action.status === "COMPLETED";
  return <article className={`flex flex-col gap-[18px] rounded-[16px] bg-[#fbfafd] px-5 pb-[18px] pt-5 lg:gap-4 lg:rounded-[20px] lg:py-[18px] ${active ? "border-[1.4px] border-[#7f62b8]" : ""}`}>
    <header className="flex items-start justify-between gap-3">
      <h3 className="min-w-0 break-words text-sm font-bold leading-normal lg:text-base">{action.title}</h3>
      <span className={`shrink-0 text-[13px] font-medium leading-none lg:text-[15px] ${completed ? "rounded-[20px] bg-[#e2dafa] px-2.5 py-1.5 text-[#796b6c]" : "text-[#838383] lg:text-[#796b6c]"}`}>{completed ? "완료" : active ? "진행 중" : "대기"}</span>
    </header>
    {completed ? <p className="whitespace-pre-wrap break-words text-[13px] font-medium leading-normal text-[#584e4d] lg:text-[15px]">{action.content}</p> : <TaskItem action={action} emphasized={active} />}
  </article>;
}

export default function PackagePage() {
  const [data, setData] = useState<PosthumousPackageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [issueMessage, setIssueMessage] = useState("");
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueReason, setIssueReason] = useState("");
  const completionInFlight = useRef(false);
  const issueInFlight = useRef(false);
  const getSessionId = () => new URLSearchParams(window.location.search).get("accessSessionId") ?? "";

  const load = async () => {
    const id = getSessionId();
    if (!id) { setError("유효한 접근 세션이 필요합니다."); setLoading(false); return; }
    try { setError(""); setData(await getPosthumousPackage(id)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "사후 패키지를 불러오지 못했습니다."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activeAction = data?.actions.find((action) => action.status !== "COMPLETED");
  const complete = async () => {
    if (!activeAction || completionInFlight.current) return;
    completionInFlight.current = true; setPending(true); setError("");
    try { await completePackageAction(getSessionId(), activeAction.actionId); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "단계를 완료하지 못했습니다."); }
    finally { completionInFlight.current = false; setPending(false); }
  };
  const submitIssue = async () => {
    const reason = issueReason.trim();
    if (!activeAction || !reason || issueInFlight.current || pending) return;
    issueInFlight.current = true; setPending(true); setError(""); setIssueMessage("");
    try {
      await reportPackageIssue(getSessionId(), activeAction.actionId, reason);
      setIssueMessage("문제가 신고되었습니다."); setIssueOpen(false); setIssueReason("");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "문제를 신고하지 못했습니다."); }
    finally { issueInFlight.current = false; setPending(false); }
  };
  const progress = data?.totalCount ? Math.min(100, (data.completedCount / data.totalCount) * 100) : 0;

  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex"><BrandLogo /></header>
    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-[120px] lg:pb-[50px] lg:pt-0">
      <header className="relative mb-5 flex w-full items-center justify-center px-1 py-2 lg:mb-0 lg:max-w-[1200px] lg:px-0 lg:py-0">
        <button aria-label="이전 페이지로 이동" className="absolute left-1 flex size-6 items-center justify-center lg:left-0 lg:size-7" onClick={() => window.history.back()} type="button">
          <Image alt="" className="size-6 rotate-180 lg:size-7" height={28} src="/icons/common/caret-right.svg" width={28} />
        </button>
        <h1 className="text-lg font-bold leading-none lg:text-xl">역할 사후 패키지</h1>
      </header>
      <div className="flex w-full flex-col gap-5 lg:mt-[50px] lg:w-[460px] lg:gap-10">
        {loading ? <p className="py-16 text-center text-sm text-[#796b6c]" role="status">사후 패키지를 불러오는 중입니다.</p> : null}
        {!loading ? <section className="flex flex-col gap-5">
          <h2 className="text-center text-base font-bold leading-none lg:text-left lg:text-lg">{data?.roleLabel ?? "역할 담당자"}</h2>
          <div className="hidden flex-col gap-3 lg:flex">
            <strong className="text-base leading-none">{data?.completedCount ?? 0}/{data?.totalCount ?? 0} 완료</strong>
            <div aria-label={`진행률 ${Math.round(progress)}%`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={Math.round(progress)} className="h-2 w-full overflow-hidden rounded-[20px] bg-[#f3f3ff]" role="progressbar">
              <div className="h-full rounded-[20px] bg-[#43306d] transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <p className="break-keep py-2.5 text-center text-xs leading-normal text-[#796b6c] lg:text-sm">{data?.notice ?? "인계 내용을 확인하고 진행해 주세요."}</p>
          <div className="flex flex-col gap-5 lg:gap-10">
            {data?.actions.map((action) => { const active = action.actionId === activeAction?.actionId; return <div className={active ? "block" : "hidden lg:block"} key={action.actionId}><ActionCard action={action} active={active} /></div>; })}
          </div>
          {data && data.actions.length === 0 ? <p className="rounded-[16px] bg-[#fbfafd] px-5 py-[18px] text-center text-sm text-[#796b6c]">진행할 사후 인계 항목이 없습니다.</p> : null}
          <div className="flex flex-col gap-3.5 pb-3.5 lg:gap-5 lg:py-5">
            <ActionButton disabled={!activeAction || pending} onClick={() => void complete()}>{pending && !issueOpen ? "처리 중..." : "완료하기"}</ActionButton>
            {activeAction ? <ActionButton disabled={pending} onClick={() => setIssueOpen(true)} secondary>문제 신고하기</ActionButton> : null}
            {issueMessage ? <p className="text-center text-sm text-[#43306d]" role="status">{issueMessage}</p> : null}
            {error ? <p className="text-center text-sm text-red-600" role="alert">{error}</p> : null}
          </div>
        </section> : null}
      </div>
    </section>
    {issueOpen ? <div aria-modal="true" className="fixed inset-0 z-50 flex items-end justify-center bg-[#28292e]/40 p-4 sm:items-center" role="dialog">
      <div className="w-full max-w-[460px] rounded-[20px] bg-[#fbfafd] p-6 shadow-xl">
        <h2 className="text-lg font-bold">문제 신고하기</h2>
        <p className="mt-2 text-sm leading-normal text-[#796b6c]">현재 단계에서 발생한 문제를 입력해 주세요.</p>
        <label className="mt-5 block text-sm font-bold" htmlFor="issue-reason">신고 사유</label>
        <textarea autoFocus className="mt-2 min-h-28 w-full resize-y rounded-[14px] border border-[#a99d9e] bg-white p-4 text-sm outline-none focus:border-[#7f62b8]" id="issue-reason" maxLength={500} onChange={(event) => setIssueReason(event.target.value)} placeholder="문제 상황을 구체적으로 입력해 주세요." value={issueReason} />
        <div className="mt-5 flex gap-3">
          <button className="min-h-11 flex-1 rounded-[14px] bg-[#eeecee] text-sm font-medium text-[#584e4d]" disabled={pending} onClick={() => { setIssueOpen(false); setIssueReason(""); }} type="button">취소</button>
          <button className="min-h-11 flex-1 rounded-[14px] bg-[#7f62b8] text-sm font-medium text-white disabled:opacity-60" disabled={!issueReason.trim() || pending} onClick={() => void submitIssue()} type="button">{pending ? "신고 중..." : "신고하기"}</button>
        </div>
      </div>
    </div> : null}
  </main>;
}

// 역할별 사후 패키지 화면
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { completePackageAction, getPosthumousPackage } from "@/lib/api/public";
import type { PosthumousPackageResponse } from "@/lib/api/public-types";

function ActionButton({ children, disabled, href, onClick, secondary = false }: { children: string; disabled?: boolean; href?: string; onClick?: () => void; secondary?: boolean }) {
  const className = `flex min-h-11 w-full items-center justify-center rounded-[14px] px-5 py-3.5 text-base font-medium leading-normal text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] lg:min-h-12 ${secondary ? "bg-[#7f62b8] hover:bg-[#7055a4]" : "bg-[#43306d] hover:bg-[#332452] lg:bg-[#3c2b62]"}`;
  return href ? <Link className={className} href={href}>{children}</Link> : <button className={className} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}

function TaskItem({ active, description, title }: { active?: boolean; description: string; title: string }) {
  return <div className={`flex min-w-0 flex-1 flex-col items-start gap-2.5 rounded-[14px] px-5 py-[18px] lg:w-full lg:flex-none lg:gap-3.5 lg:rounded-[20px] ${active ? "border-[1.2px] border-[#7f62b8] bg-[#f3f3ff] lg:border-[1.4px]" : "bg-[#eeecee]"}`}>
    <Image alt="" className="size-5 lg:size-[22px]" height={22} src={active ? "/icons/inspection/check-circle.svg" : "/icons/inspection/x-circle.svg"} width={22} />
    <div className="flex flex-col gap-1.5 lg:gap-2">
      <h3 className="text-sm font-bold leading-none lg:text-base">{title}</h3>
      <p className="whitespace-nowrap text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{description}</p>
    </div>
  </div>;
}

export default function PackagePage() {
  const [data, setData] = useState<PosthumousPackageResponse | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const completionInFlight = useRef(false);
  const sessionId = () => new URLSearchParams(window.location.search).get("accessSessionId") ?? "";
  const load = async () => { const id = sessionId(); if (!id) return setError("유효한 접근 세션이 필요합니다."); try { setData(await getPosthumousPackage(id)); } catch (reason) { setError(reason instanceof Error ? reason.message : "사후 패키지를 불러오지 못했습니다."); } };
  // 최초 접근 세션은 URL에서 한 번만 읽습니다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { queueMicrotask(() => void load()); }, []);
  const activeAction = data?.actions.find((action) => action.status !== "COMPLETED");
  const complete = async () => { if (!activeAction || completionInFlight.current) return; completionInFlight.current = true; setPending(true); try { await completePackageAction(sessionId(), activeAction.actionId); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : "단계를 완료하지 못했습니다."); } finally { completionInFlight.current = false; setPending(false); } };
  const issueHref = activeAction ? "/backup?accessSessionId=" + encodeURIComponent(sessionId()) + "&actionId=" + encodeURIComponent(activeAction.actionId) : "/backup";
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex"><BrandLogo /></header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <header className="mb-5 flex w-full items-center justify-center py-2 lg:mb-0">
        <h1 className="text-lg font-bold leading-none lg:text-xl">역할 사후 패키지</h1>
      </header>

      <div className="flex w-full flex-col gap-5 lg:mt-[50px] lg:w-[460px] lg:gap-10">
        <section className="flex flex-col gap-5">
          <h2 className="text-center text-base font-bold leading-none lg:text-left lg:text-lg">{data?.roleLabel ?? "역할 담당자"}</h2>

          <div className="flex flex-col gap-3">
            <strong className="text-sm leading-none lg:text-base">{data?.completedCount ?? 0}/{data?.totalCount ?? 0} 완료</strong>
            <div className="h-2 w-full overflow-hidden rounded-[20px] bg-[#f3f3ff]">
              <div className="h-full rounded-l-[20px] bg-[#43306d]" style={{ width: data?.totalCount ? ((data.completedCount / data.totalCount) * 100) + "%" : "0%" }} />
            </div>
          </div>

          <p className="py-2.5 text-center text-xs leading-none text-[#796b6c] lg:text-sm">{data?.notice ?? "인계 내용을 확인하고 있어요."}</p>

          {data?.actions.map((action) => {
            const active = action.actionId === activeAction?.actionId;
            const completed = action.status === "COMPLETED";
            return (
              <article className={`flex flex-col gap-[18px] rounded-[16px] bg-[#fbfafd] px-5 pb-[18px] pt-5 lg:gap-4 lg:rounded-[20px] lg:py-[18px] ${active ? "border-[1.4px] border-[#7f62b8]" : ""}`} key={action.actionId}>
                <header className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold leading-none lg:text-base">{action.title}</h3>
                  <span className={`shrink-0 text-[13px] font-medium leading-none lg:text-[15px] ${completed ? "rounded-[20px] bg-[#e2dafa] px-2.5 py-1.5 text-[#796b6c]" : "text-[#838383] lg:text-[#796b6c]"}`}>
                    {completed ? "완료" : active ? "진행 중" : "대기"}
                  </span>
                </header>
                <div className="flex gap-2.5 lg:flex-col">
                  <TaskItem active={active || completed} description={action.content} title={action.targetName ?? action.action} />
                </div>
              </article>
            );
          })}

          {data && data.actions.length === 0 ? (
            <p className="rounded-[16px] bg-[#fbfafd] px-5 py-[18px] text-center text-sm text-[#796b6c]">진행할 사후 인계 항목이 없습니다.</p>
          ) : null}

          <div className="flex flex-col gap-3.5 pb-3.5 lg:gap-5 lg:py-5">
            <ActionButton disabled={!activeAction || pending} onClick={() => void complete()}>완료하기</ActionButton>
            {activeAction ? <ActionButton href={issueHref} secondary>문제 신고하기</ActionButton> : null}
            {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
          </div>
        </section>
      </div>
    </section>
  </main>;
}

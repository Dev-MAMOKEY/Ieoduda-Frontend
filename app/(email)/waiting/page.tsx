// 사후 인계 대기 기간 및 이의 제기 화면
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { cancelReleaseCase, createObjection, getWaitingStatus } from "@/lib/api/public";
import type { ReleaseStatusResponse } from "@/lib/api/public-types";

function ActionButton({ children, disabled, onClick, secondary = false }: { children: string; disabled?: boolean; onClick?: () => void; secondary?: boolean }) {
  const colorClass = secondary
    ? "bg-[#7f62b8] hover:bg-[#7055a4]"
    : "bg-[#43306d] hover:bg-[#332452] lg:bg-[#3c2b62]";

  return (
    <button
      className={"flex min-h-11 w-full items-center justify-center rounded-[14px] px-5 py-3.5 text-sm font-medium leading-none text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] lg:min-h-12 lg:text-base " + colorClass}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function NoticeCard({
  appeal = false,
  children,
  disabled,
  onClick,
  title,
}: {
  appeal?: boolean;
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  title: string;
}) {
  return (
    <article className="flex w-full flex-col gap-[18px] rounded-[20px] bg-[#f3f3ff] px-5 py-[18px] lg:pb-[22px]">
      <div className="flex flex-col items-start gap-2.5 lg:gap-4 lg:pb-3">
        <div className="flex flex-col items-start gap-2.5">
          <Image alt="" className="size-6" height={24} src="/icons/life-area-warning.svg" width={24} />
          <h2 className="text-sm font-bold leading-none lg:text-base">{title}</h2>
        </div>
        <div className="text-xs font-medium leading-normal text-[#796b6c] lg:text-sm">{children}</div>
      </div>

      <div className={appeal ? "flex flex-col gap-3" : "flex flex-col"}>
        <ActionButton disabled={disabled} onClick={onClick} secondary={appeal}>{appeal ? "이의 제기하기" : "본인 확인 후 취소하기"}</ActionButton>
        {appeal && (
          <p className="text-center text-xs leading-none text-[#796b6c]">
            사유 및 증빙 자료 제출을 해야 이의 제기가 가능해요
          </p>
        )}
      </div>
    </article>
  );
}

export default function WaitingPage() {
  const [status, setStatus] = useState<ReleaseStatusResponse | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const query = () => new URLSearchParams(window.location.search);
  useEffect(() => {
    const caseId = query().get("caseId");
    if (!caseId) { queueMicrotask(() => setError("유효한 공개 절차 정보가 필요합니다.")); return; }
    getWaitingStatus(caseId).then(setStatus).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "대기 정보를 불러오지 못했습니다."));
  }, []);
  const cancel = async () => {
    const caseId = query().get("caseId");
    const token = query().get("token");
    if (!caseId || !token) return setError("유효한 취소 링크 정보가 필요합니다.");
    setPending(true);
    try { setStatus(await cancelReleaseCase(caseId, token)); } catch (reason) { setError(reason instanceof Error ? reason.message : "절차를 취소하지 못했습니다."); } finally { setPending(false); }
  };
  const appeal = async () => {
    const params = query();
    const caseId = params.get("caseId") ?? "";
    const token = params.get("token") ?? "";
    if (!caseId || !token) return setError("유효한 이의 제기 링크 정보가 필요합니다.");
    const objectionReason = window.prompt("이의 제기 사유를 입력해 주세요.")?.trim() ?? "";
    if (!objectionReason) return;
    setPending(true);
    setError("");
    try {
      await createObjection(caseId, token, objectionReason);
      setStatus(await getWaitingStatus(caseId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "이의 제기를 접수하지 못했습니다.");
    } finally {
      setPending(false);
    }
  };
  return (
    <main className="min-h-dvh text-[#43306d]">
      <header className="hidden h-[125px] items-center px-[120px] lg:flex">
        <BrandLogo />
      </header>

      <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-20 lg:pt-0">
        <header className="mb-[22px] flex w-full items-center justify-center py-2 lg:mb-0 lg:py-0">
          <h1 className="text-lg font-bold leading-none lg:text-xl">사후 인계</h1>
        </header>

        <div className="flex w-full flex-col items-center gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-10">
          <div className="flex flex-col items-center gap-1.5 text-lg font-bold leading-none lg:flex-row lg:text-xl">
            <p>등록된 계획이</p>
            <p>실행 대기 중이에요</p>
          </div>

          <section className="flex w-full flex-col items-center gap-3 rounded-[20px] bg-[#fbfafd] px-5 py-[22px] lg:py-6">
            <div className="flex flex-col items-center gap-2 lg:gap-2.5">
              <p className="text-xs font-semibold leading-none text-[#796b6c] lg:text-sm">예정 발송일</p>
              <strong className="text-lg leading-none lg:text-xl">{status?.waitingEndsAt ? new Date(status.waitingEndsAt).toLocaleDateString("ko-KR") : "확인 중"}</strong>
            </div>
            <div className="flex flex-col items-center gap-2 lg:gap-2.5">
              <strong className="text-base leading-none lg:text-lg">남은 기간 {status?.remainingDays ?? "-"}일</strong>
              <p className="text-xs font-medium leading-none text-[#796b6c] lg:text-sm">그 전까지는 언제든 취소가 가능해요</p>
            </div>
          </section>

          <NoticeCard disabled={pending || !status?.hasActiveCase} onClick={() => void cancel()} title="실행을 멈추시고 싶으신가요?">
            <p>본인이라면 전체 절차를 즉시 취소할 수 있어요.</p>
            <p>멈추면 아무것도 실행되지 않고 계획은 다시 대기 상태로 돌아가요.</p>
          </NoticeCard>

          <NoticeCard appeal disabled={pending || !status?.hasActiveCase} onClick={() => void appeal()} title="무언가 잘못됐다면?">
            <p>이의 제기 연락처는 사유와 증빙을 제출할 수 있어요.</p>
            <p>이의가 접수되면 계획은 확인될 때까지 자동으로 멈춰요.</p>
          </NoticeCard>
          {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
        </div>

        <footer className="mt-[22px] flex flex-col items-center gap-9 text-center text-xs leading-none text-[#796b6c] lg:mt-10 lg:gap-3 lg:text-sm">
          <p>이어두다는 이 링크로 비밀번호나 결제 정보를 요구하지 않아요.</p>
          <p>
            궁금한 점은 문의해 주세요.{" "}
            <Link className="text-[#584e4d] underline underline-offset-2" href="mailto:support@ieoduda.com">문의하기</Link>
          </p>
        </footer>
      </section>
    </main>
  );
}

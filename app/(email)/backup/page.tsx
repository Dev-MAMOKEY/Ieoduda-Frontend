// 단계별 대체 담당자 화면
"use client";

import Image from "next/image";
import { BrandLogo } from "@/components/BrandLogo";
import { PageHeader } from "@/components/PageHeader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { completePackageAction, getPosthumousPackage, reportPackageIssue } from "@/lib/api/public";
import type { PackageActionResponse } from "@/lib/api/public-types";

function ActionButton({ children, disabled, onClick, secondary = false }: { children: string; disabled?: boolean; onClick: () => void; secondary?: boolean }) {
  return <button className={`flex min-h-11 w-full items-center justify-center rounded-[14px] px-5 py-3.5 text-sm font-medium leading-normal text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] disabled:opacity-50 lg:min-h-12 lg:text-base ${secondary ? "bg-[#7f62b8] hover:bg-[#7055a4]" : "bg-[#43306d] hover:bg-[#332452] lg:bg-[#3c2b62]"}`} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}

function PersonCard({ backup = false }: { backup?: boolean }) {
  return <article className="flex w-full flex-col gap-[18px] rounded-[16px] bg-[#fbfafd] px-5 pb-[18px] pt-5 lg:rounded-[20px] lg:py-[18px]">
    <header className="flex items-start justify-between">
      <div className="flex flex-col gap-3 lg:gap-2">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-sm font-bold leading-none lg:text-base">{backup ? "대체 담당자" : "관계 정리 담당자"}</h2>
          <strong className="text-sm font-semibold leading-none text-[#584e4d] lg:text-[17px]">{backup ? "대체 담당자" : "현재 담당자"}</strong>
        </div>
        <p className="text-xs font-medium leading-none text-[#796b6c] lg:text-sm">{backup ? "아직 연락하지 않았어요" : "이메일은 정상적으로 전달 되었어요"}</p>
      </div>
      <span className="text-[13px] font-medium leading-none text-[#796b6c] lg:text-[15px] lg:text-[#838383]">{backup ? "대기" : "무응답"}</span>
    </header>

    {!backup && <div className="flex w-full flex-col items-center gap-1.5 rounded-[14px] bg-[#f3f3ff] px-5 py-[18px] lg:gap-2 lg:rounded-[20px]">
      <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">대체 담당자에게 넘어가기까지</p>
      <strong className="text-sm leading-none lg:text-base">남은시간 2일 9시간</strong>
    </div>}
  </article>;
}

export default function BackupPage() {
  const router = useRouter();
  const [action, setAction] = useState<PackageActionResponse | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const query = () => new URLSearchParams(window.location.search);
  useEffect(() => {
    const params = query();
    const sessionId = params.get("accessSessionId");
    const actionId = params.get("actionId");
    if (!sessionId || !actionId) {
      queueMicrotask(() => setMessage("유효한 단계 정보가 필요합니다."));
      return;
    }
    getPosthumousPackage(sessionId)
      .then((packageData) => {
        const selectedAction = packageData.actions.find((item) => item.actionId === actionId);
        if (!selectedAction) throw new Error("해당 단계를 찾을 수 없습니다.");
        setAction(selectedAction);
      })
      .catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "단계 정보를 불러오지 못했습니다."));
  }, []);
  const finish = async () => { const params = query(); const sessionId = params.get("accessSessionId"); const actionId = params.get("actionId"); if (!sessionId || !actionId) return setMessage("유효한 단계 정보가 필요합니다."); setPending(true); try { await completePackageAction(sessionId, actionId); router.push("/package?accessSessionId=" + encodeURIComponent(sessionId)); } catch (reason) { setMessage(reason instanceof Error ? reason.message : "단계를 완료하지 못했습니다."); } finally { setPending(false); } };
  const report = async () => { const params = query(); const sessionId = params.get("accessSessionId"); const actionId = params.get("actionId"); if (!sessionId || !actionId) return setMessage("유효한 단계 정보가 필요합니다."); const reason = window.prompt("문제가 발생한 이유를 입력해 주세요.") ?? ""; if (!reason) return; setPending(true); try { await reportPackageIssue(sessionId, actionId, reason); setMessage("문제가 신고되었습니다."); } catch (failure) { setMessage(failure instanceof Error ? failure.message : "문제를 신고하지 못했습니다."); } finally { setPending(false); } };
  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex"><BrandLogo /></header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <PageHeader
        backHref="/package"
        backLabel="역할 사후 패키지로 돌아가기"
        className="mb-5 py-2 lg:mb-0 lg:w-[460px] lg:py-0"
        title="단계별 대체 담당자"
      />

      <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-10">
        <section className="flex flex-col gap-[22px]">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold leading-none text-[#584e4d] lg:text-base lg:font-medium">현재 단계</p>
            <h2 className="text-base font-bold leading-none lg:text-lg">{action?.title ?? "단계 정보 확인 중"}</h2>
          </div>

          <article className="rounded-[14px] bg-[#fbfafd] px-5 py-[18px]">
            <h3 className="text-sm font-bold leading-none lg:text-base">완료 조건</h3>
            <p className="mt-2 text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">{action?.precondition ?? action?.content ?? "완료 조건을 확인하고 있어요"}</p>
          </article>

          <PersonCard />

          <div className="flex flex-col gap-3.5 pb-3.5 lg:gap-5 lg:py-5">
            <ActionButton disabled={pending} onClick={() => void finish()}>완료하기</ActionButton>
            <ActionButton disabled={pending} onClick={() => void report()} secondary>문제 신고하기</ActionButton>
            {message ? <p className="text-center text-sm text-[#584e4d]">{message}</p> : null}
          </div>
        </section>

        <section className="flex flex-col gap-3 lg:gap-[22px]">
          <p className="text-center text-xs leading-none text-[#796b6c] lg:text-sm">시간이 지나면 대체 담당자에게 자동 이관돼요.</p>
          <PersonCard backup />
          <div className="flex items-center justify-center gap-2 py-2.5">
            <Image alt="" className="size-[18px]" height={18} src="/icons/email/lock.svg" width={18} />
            <p className="text-[13px] font-medium leading-none text-[#584e4d] lg:text-[15px]">다음 단계는 이 단계가 끝나야 열려요.</p>
          </div>
        </section>
      </div>
    </section>
  </main>;
}

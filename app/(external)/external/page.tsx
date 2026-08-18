"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { decidePartnerReview, getPartnerReview } from "@/lib/api/partner";
import type { PartnerReview } from "@/lib/api/partner-types";

const evidenceTitle = { DEATH_CERTIFICATE: "사망 진단서", DEATH_REPORT: "사망 신고서", POSTMORTEM_REPORT: "검안서" } as const;

function DocumentSheet() {
  return <div aria-label="증빙 문서 미리보기" className="flex h-[300px] w-[230px] flex-col items-center gap-5 border border-[#d7d0d0] bg-white px-5 py-[21px] lg:h-auto lg:w-[340px] lg:border-[1.4px] lg:p-5">
    <span className="h-3.5 w-[95px] shrink-0 bg-[#d7d0d0]" />
    {[0, 1, 2].map((group) => <div className={`flex w-full flex-col gap-3 ${group === 2 ? "hidden lg:flex" : ""}`} key={group}>
      {Array.from({ length: 6 }, (_, index) => <span className="h-0.5 w-full shrink-0 bg-[#d7d0d0]" key={index} />)}
    </div>)}
  </div>;
}

function ActionButton({ children, disabled, onClick, tone }: { children: string; disabled?: boolean; onClick: () => void; tone: "secondary" | "light" }) {
  return <button className={`flex min-h-11 w-full items-center justify-center rounded-[14px] px-5 py-3.5 text-sm font-medium leading-none transition-colors disabled:opacity-50 lg:text-base ${tone === "secondary" ? "bg-[#7f62b8] text-[#fbfafd] hover:bg-[#7055a4]" : "bg-[#e2dafa] text-[#43306d] hover:bg-[#d6caef]"}`} disabled={disabled} onClick={onClick} type="button">{children}</button>;
}

export default function ExternalReviewPage() {
  const [review, setReview] = useState<PartnerReview | null>(null);
  const [memo, setMemo] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const reviewId = new URLSearchParams(window.location.search).get("doc");
    if (!reviewId) { queueMicrotask(() => setError("검토할 증빙 자료가 지정되지 않았습니다.")); return; }
    getPartnerReview(reviewId).then(setReview).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "증빙 자료를 불러오지 못했습니다."));
  }, []);
  const decide = async (decision: "APPROVE" | "REJECT" | "ADDITIONAL_INFO_REQUESTED") => {
    if (!review || pending) return;
    const password = window.prompt("검토자 비밀번호를 입력해 주세요.") ?? "";
    if (!password) return;
    setPending(true);
    setError("");
    try { setReview(await decidePartnerReview(review.reviewId, decision, password, memo || undefined)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "검토 결과를 저장하지 못했습니다."); }
    finally { setPending(false); }
  };
  const document = review ? { owner: review.targetName, title: evidenceTitle[review.evidenceType], submittedAt: new Date(review.submittedAt).toLocaleString("ko-KR") } : { owner: "", title: "증빙 자료", submittedAt: "확인 중" };

  return <main className="min-h-dvh text-[#43306d]">
    <header className="hidden h-[125px] items-center px-[120px] lg:flex"><BrandLogo /></header>

    <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-[50px] lg:pt-0">
      <PageHeader backHref="/evidence" className="mb-[22px] py-2 lg:hidden" title="" />
      <header className="hidden w-[460px] grid-cols-[24px_1fr_24px] items-center lg:grid">
        <BackButton href="/evidence" label="등록된 증빙 자료로 돌아가기" />
        <h1 className="text-center text-xl font-bold leading-none">{document.owner}님의 증빙 자료</h1>
        <span aria-hidden className="size-6" />
      </header>

      <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-5">
        <section className="flex w-full flex-col items-center gap-[18px] rounded-[20px] bg-[#fbfafd] px-5 py-6 lg:gap-[60px] lg:py-9">
          <header className="flex flex-col items-center gap-2 text-center lg:gap-3">
            <h2 className="text-base font-bold leading-none lg:text-lg">{document.title}.pdf</h2>
            <p className="text-xs font-medium leading-none text-[#796b6c] lg:text-sm">제출일 {document.submittedAt}</p>
          </header>
          <DocumentSheet />
        </section>

        <section className="flex flex-col gap-3 lg:gap-5">
          <div className="flex flex-col items-center gap-1.5 py-0 text-center text-xs leading-none text-[#796b6c] lg:gap-2 lg:pb-2.5 lg:pt-0.5 lg:text-sm">
            <p>이 검토는 사망 사실 확인만을 위한 거예요.</p>
            <p>계획 내용·역할별 패키지에는 접근할 수 없어요.</p>
          </div>

          <label className="flex flex-col gap-2.5">
            <span className="px-2.5 text-sm font-bold leading-none lg:px-0 lg:text-base">검토 메모</span>
            <input className="min-h-11 w-full rounded-[14px] border-0 bg-[#fbfafd] px-4 py-3.5 text-[13px] font-medium leading-none text-[#584e4d] outline-none placeholder:text-[#a99d9e] focus-visible:ring-2 focus-visible:outline-[#43306d]/25 lg:rounded-[20px] lg:px-5 lg:text-[15px]" onChange={(event) => setMemo(event.target.value)} placeholder="검토 근거를 작성해 주세요" value={memo} />
          </label>

          <div className="flex flex-col gap-3.5 lg:gap-[22px]">
            <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-1 lg:gap-[22px]">
              <Button disabled={!review || pending} onClick={() => void decide("APPROVE")} type="button">승인하기</Button>
              <ActionButton disabled={!review || pending} onClick={() => void decide("REJECT")} tone="secondary">반려하기</ActionButton>
            </div>
            <ActionButton disabled={!review || pending} onClick={() => void decide("ADDITIONAL_INFO_REQUESTED")} tone="light">추가자료 요청하기</ActionButton>
            {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}
          </div>
        </section>
      </div>
    </section>
  </main>;
}

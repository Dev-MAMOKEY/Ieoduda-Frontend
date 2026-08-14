"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { FormField } from "@/components/FormField";
import { getExternalReview } from "@/lib/api";

const actionClass =
  "flex h-[45px] w-full items-center justify-center rounded-[20px] border-0 bg-[#a8a8a8] px-5 text-sm text-white transition-all duration-200 hover:bg-[#929292] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383] active:scale-[0.985] lg:h-[47px] lg:rounded-[30px] lg:text-[15px]";

function DocumentPreview({
  initialDocument,
}: {
  initialDocument: { name: string; receivedAt: string };
}) {
  const [document, setDocument] = useState<{
    name: string;
    receivedAt: string;
    file: File | null;
  }>({ ...initialDocument, file: null });
  const [isDragging, setIsDragging] = useState(false);

  const receiveFile = (file: File) => {
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    )
      return;
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");
    const receivedAt = `${pad(now.getFullYear() % 100)}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setDocument({ name: file.name, receivedAt, file });
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) receiveFile(file);
  };

  return (
    <section
      className={`flex w-full flex-col items-center gap-[18px] rounded-[20px] bg-white px-5 py-6 transition-shadow lg:h-[700px] lg:w-[500px] lg:gap-[60px] lg:py-9 ${isDragging ? "ring-2 ring-[#838383] ring-offset-2 ring-offset-[#f0f0f2]" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setIsDragging(false);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
      }}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-2">
        <h2 className="max-w-full truncate text-sm font-bold lg:text-base">
          {document.name}
        </h2>
        <p className="text-[11px] font-medium text-[#838383] lg:text-sm">
          받은 시간 {document.receivedAt}
        </p>
      </div>
      <div
        aria-label="사망 진단서 미리보기"
        className="flex h-[300px] w-[230px] flex-col items-center gap-5 border border-[#d5d5d5] bg-white px-5 py-[21px] lg:h-[450px] lg:w-[345px] lg:gap-[30px] lg:px-[30px] lg:py-8"
      >
        <span className="h-3.5 w-[95px] bg-[#d9d9d9] lg:h-5 lg:w-[142px]" />
        {[0, 1].map((group) => (
          <span className="flex flex-col gap-3 lg:gap-[18px]" key={group}>
            {Array.from({ length: 6 }, (_, i) => (
              <span
                className="h-0.5 w-40 bg-[#d9d9d9] lg:h-[3px] lg:w-60"
                key={i}
              />
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}

function SubjectCard({
  subject,
}: {
  subject: { name: string; birthDate: string; matchStatus: string };
}) {
  return (
    <section className="flex items-center justify-between rounded-[20px] bg-white px-5 py-[18px]">
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold lg:text-base">대상자 정보</h2>
        <div className="flex flex-col gap-2 text-[13px] font-medium text-[#838383] lg:text-sm">
          <span>{subject.name}</span>
          <span>{subject.birthDate}</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Image
          alt=""
          className="size-[18px] lg:size-5"
          width={20}
          height={20}
          src="/icons/inspection/check-circle.svg"
        />
        <span className="text-[11px] font-medium text-[#838383] lg:text-xs">
          {subject.matchStatus}
        </span>
      </div>
    </section>
  );
}

export default function ExternalReviewPage() {
  const review = getExternalReview();
  const [memo, setMemo] = useState("");
  return (
    <main
      className="min-h-dvh bg-[#f0f0f2] px-6 py-[70px] text-[#28292e] lg:px-0 lg:py-0"
      data-node-id="439:4353"
    >
      <header className="hidden h-[125px] grid-cols-3 items-center px-[50px] lg:grid">
        <Link className="w-fit p-2 text-[22px] font-semibold" href="/">
          이어두다
        </Link>
        <span />
        <span />
      </header>
      <div className="mx-auto flex w-full max-w-[390px] flex-col gap-[22px] lg:max-w-[1440px] lg:gap-0">
        <header className="flex justify-center pb-5 lg:pb-0">
          <h1 className="text-center text-lg font-bold lg:text-xl">
            외부 파트너 증빙
          </h1>
        </header>
        <div className="flex flex-col gap-[22px] lg:grid lg:grid-cols-[500px_minmax(0,1fr)] lg:gap-10 lg:px-[120px] lg:py-[50px]">
          <DocumentPreview initialDocument={review.document} />
          <div className="flex flex-col gap-[22px] lg:min-h-[520px] lg:justify-between">
            <div className="flex flex-col gap-[22px]">
              <SubjectCard subject={review.subject} />
              <div className="text-center text-xs font-medium leading-relaxed text-[#838383] lg:text-sm">
                <p>이 검토는 사망 사실 확인만을 위한 거예요.</p>
                <p>계획 내용·역할별 패키지에는 접근할 수 없어요.</p>
              </div>
              <FormField
                id="review-memo"
                label="검토 메모"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMemo(e.target.value)
                }
                placeholder="검토 근거를 작성해 주세요"
                value={memo}
              />
            </div>
            <div className="flex flex-col gap-3.5 lg:gap-[22px]">
              <button className={actionClass} type="button">
                승인하기
              </button>
              <button className={actionClass} type="button">
                반려 요청하기
              </button>
              <button className={actionClass} type="button">
                추가 자료 요청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

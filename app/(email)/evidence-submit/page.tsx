// 공식 증빙 자료 제출 화면
"use client";

import Image from "next/image";
import { useState, type DragEvent } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { submitEvidence } from "@/lib/api/public";

const evidenceTypes = [
  { mobile: "사망 진단서", desktop: "사망 진단서" },
  { mobile: "사망 신고서", desktop: "사망 신고 접수증" },
  { mobile: "검안서", desktop: "검안서" },
];

export default function EvidenceSubmitPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const selectFiles = (selectedFiles: File[]) => {
    const acceptedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const validFiles = selectedFiles.filter((file) => acceptedTypes.includes(file.type) && file.size <= 25 * 1024 * 1024);
    setFiles(validFiles.slice(0, 3));
    if (validFiles.length !== selectedFiles.length) setMessage("PDF, JPG, PNG 형식의 25MB 이하 파일만 선택할 수 있습니다.");
    else if (selectedFiles.length > 3) setMessage("파일은 최대 3개까지 선택할 수 있습니다.");
    else setMessage("");
  };
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFiles(Array.from(event.dataTransfer.files));
  };
  const submit = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const caseId = searchParams.get("caseId") ?? "";
    if (!caseId) return setMessage("유효한 공개 절차 정보가 필요합니다.");
    setPending(true);
    setMessage("");
    try {
      await submitEvidence(caseId, files);
      setMessage("증빙 자료가 제출되었습니다.");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "증빙 자료를 제출하지 못했습니다.");
    } finally { setPending(false); }
  };
  return (
    <main className="min-h-dvh text-[#43306d]">
      <header className="hidden h-[125px] items-center px-[120px] lg:flex">
        <BrandLogo />
      </header>

      <section className="mx-auto flex w-full max-w-[390px] flex-col items-center px-6 pb-8 pt-[59px] lg:max-w-none lg:px-0 lg:pb-20 lg:pt-0">
        <PageHeader
          backHref="/death-report"
          backLabel="사망 신고 이메일로 돌아가기"
          className="mb-[22px] py-2 lg:mb-0 lg:w-[460px] lg:py-0"
          title={<><span className="lg:hidden">증빙 자료 제출</span><span className="hidden lg:inline">공식 증빙 자료 제출</span></>}
        />

        <div className="flex w-full flex-col gap-[22px] lg:mt-[50px] lg:w-[460px] lg:gap-10">
          <section className="flex flex-col items-start gap-4 self-center text-left lg:w-full lg:self-auto lg:gap-5">
            <div className="flex w-full flex-col items-start gap-2 text-left lg:gap-2.5">
              <h2 className="text-base font-bold leading-none lg:text-lg">공식 증빙 자료</h2>
              <p className="text-[13px] font-medium leading-none text-[#584e4d]">셋 중에 하나의 서류만 제출해도 확인이 가능해요</p>
            </div>
            <div className="flex gap-2.5">
              {evidenceTypes.map((type) => (
                <span className="flex items-center justify-center whitespace-nowrap rounded-[14px] bg-[#fbfafd] px-4 py-2.5 text-[13px] font-medium leading-none lg:rounded-[30px] lg:px-5 lg:py-3 lg:text-[15px]" key={type.mobile}>
                  <span className="lg:hidden">{type.mobile}</span>
                  <span className="hidden lg:inline">{type.desktop}</span>
                </span>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-[22px] pb-3.5 pt-2.5 lg:gap-6 lg:pb-[18px] lg:pt-3">
            <label
              className={`flex cursor-pointer flex-col items-center gap-2.5 rounded-[16px] border-[1.4px] border-[#43306d] px-5 py-[26px] text-center transition-colors lg:rounded-[20px] ${dragging ? "bg-[#e2dafa]" : "bg-[#f3f3ff]"}`}
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
              onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }}
              onDrop={handleDrop}
            >
              <Image alt="" className="size-6 lg:size-[26px]" height={26} src="/icons/email/folder-plus.svg" width={26} />
              <strong className="text-sm leading-none lg:text-base">파일을 끌어다 놓거나 눌러서 선택</strong>
              <span className="text-xs font-medium leading-none text-[#584e4d] lg:text-sm">PDF･JPG･PNG･최대 25MB･최대 3개</span>
              <input accept=".pdf,.jpg,.jpeg,.png" className="sr-only" multiple onChange={(event) => selectFiles(Array.from(event.target.files ?? []))} type="file" />
            </label>

            {files.map((file, index) => <div className="flex items-center justify-between rounded-[14px] bg-[#fbfafd] px-5 py-4 lg:rounded-[20px]" key={file.name + index}>
              <div className="flex min-w-0 items-center gap-2.5"><strong className="truncate text-sm leading-none lg:text-base">{file.name}</strong><span className="shrink-0 text-xs font-medium leading-none text-[#796b6c] lg:text-sm">{(file.size / 1024 / 1024).toFixed(1)}MB</span></div>
              <button aria-label={file.name + " 파일 제거"} className="flex size-5 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d]" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} type="button"><Image alt="" className="size-5" height={20} src="/icons/email/close.svg" width={20} /></button>
            </div>)}
          </section>

          <section className="flex flex-col gap-[22px]">
            <aside className="rounded-[16px] bg-[#f3f3ff] px-5 pb-[22px] pt-[18px] lg:rounded-[20px]">
              <div className="flex flex-col items-start gap-2.5">
                <Image alt="" className="size-[22px]" height={22} src="/icons/email/handoff-warning-circle.svg" width={22} />
                <h2 className="text-sm font-bold leading-none lg:text-base">보관 및 삭제 안내</h2>
                <p className="text-xs font-medium leading-normal text-[#796b6c] lg:text-sm">
                  제출하신 서류는 검토 목적 외에는 사용하지 않으며, 검토 완료 후 30일 이내 자동 삭제돼요. 검토 파트너만 열람하고 다른 담당자에겐 공개되지 않아요.
                </p>
              </div>
            </aside>

            <label className="flex cursor-pointer items-center gap-[18px] px-2.5 py-2.5 text-[13px] font-medium leading-normal text-[#584e4d] lg:text-[15px]">
              <span className="relative flex size-4 shrink-0 items-center justify-center lg:size-[18px]">
                <input
                  className="peer size-full cursor-pointer appearance-none rounded-full border border-[#584e4d] bg-transparent checked:border-[#43306d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d]"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  type="checkbox"
                />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex">
                  <Image alt="" className="size-3" height={12} src="/icons/agreement/check.svg" width={12} />
                </span>
              </span>
              <span>위 안내사항을 확인했으며,<br />검토를 위해 서류 제출하는 것에 동의해요.</span>
            </label>

            <div className="flex flex-col gap-3.5 pt-3 lg:gap-[18px]">
              <Button disabled={!agreed || files.length === 0 || pending} onClick={() => void submit()} type="button">{pending ? "제출 중..." : "제출하기"}</Button>
              {message ? <p className="text-center text-sm text-[#584e4d]">{message}</p> : null}
              <p className="pb-2.5 text-center text-xs font-medium leading-none text-[#796b6c] lg:text-sm lg:font-normal">
                제출 후 파트너가 검토하고, 결과를 이메일로 알려드려요
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

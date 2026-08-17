"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export default function ServiceInfoPage() {
  const [serviceGuideAgreed, setServiceGuideAgreed] = useState(false);
  const [handoffGuideAgreed, setHandoffGuideAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!serviceGuideAgreed || !handoffGuideAgreed) {
      setError("사후 인계 조건과 안전 범위를 확인해 주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/consents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          serviceGuideAgreed,
          handoffGuideAgreed,
        }),
      });

      if (!response.ok) {
        setError("동의 내용을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      window.location.assign("/new-plan");
    } catch {
      setError("동의 내용을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh w-full bg-[#f1eff6]">
      <section className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col overflow-hidden px-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Image
            src="/images/figma-bg-1.jpeg"
            alt=""
            fill
            priority
            sizes="390px"
            className="object-cover object-top"
          />
        </div>

        <form className="relative z-10 flex min-h-dvh flex-col" onSubmit={handleSubmit} noValidate>
          <header className="flex h-[60px] shrink-0 items-center justify-center">
            <h1 className="text-[18px] font-bold leading-none text-[var(--purple-1)]">서비스 중요 안내 사항</h1>
          </header>

          <div className="flex flex-1 flex-col justify-between pb-[34px]">
            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-[30px] rounded-[14px] bg-[var(--white)] px-3 py-3 text-[13px] font-medium text-[var(--brown-1)]">
                <h2 className="text-center text-[18px] font-bold leading-none text-[var(--purple-1)]">서비스 및 금지 정보 안내</h2>
                <div className="flex flex-col gap-[26px]">
                  <ul className="list-disc space-y-4 pl-[19px] leading-normal">
                    <li>사망이 안전하게 확인되면, 가족과 동료에게 필요한 일을 올바른 순서로 이메일로 전달합니다.</li>
                    <li>비밀번호를 적지 마세요. 계정 이름, 자료 위치의 유형과 원하는 처리 결과만 작성합니다.</li>
                  </ul>
                  <label className="flex cursor-pointer items-center gap-[14px] text-black">
                    <input
                      type="checkbox"
                      checked={serviceGuideAgreed}
                      onChange={(event) => setServiceGuideAgreed(event.target.checked)}
                      className="size-3 shrink-0 accent-[#43306d]"
                    />
                    <span>위 내용을 이해했으며 동의합니다.</span>
                  </label>
                </div>
              </section>

              <section className="flex flex-col gap-[30px] rounded-[14px] bg-[var(--white)] px-3 py-3 text-[13px] font-medium text-[var(--brown-1)]">
                <h2 className="text-center text-[18px] font-bold leading-none text-[var(--purple-1)]">실제 사후 인계 안내</h2>
                <div className="flex flex-col gap-[26px]">
                  <ul className="list-disc pl-[19px] leading-normal">
                    <li>지정 확인자 2명의 신고가 필요합니다.</li>
                    <li>외부 법무·장례 파트너가 공식 증빙을 검토합니다.</li>
                    <li>승인 후 7~30일의 취소 가능한 대기 기간을 거칩니다.</li>
                    <li>이메일에는 민감 정보를 넣지 않고 보안 링크만 발송합니다.</li>
                    <li>서비스가 실제 계정을 자동 삭제·이전하지 않습니다.</li>
                  </ul>
                  <label className="flex cursor-pointer items-center gap-[14px] text-black">
                    <input
                      type="checkbox"
                      checked={handoffGuideAgreed}
                      onChange={(event) => setHandoffGuideAgreed(event.target.checked)}
                      className="size-3 shrink-0 accent-[#43306d]"
                    />
                    <span>위 내용을 이해했으며 동의합니다.</span>
                  </label>
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-2">
              {error && <p role="alert" className="text-center text-xs text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[45px] w-full items-center justify-center rounded-[14px] bg-[#3c2b62] px-5 text-[14px] font-medium leading-none text-[var(--white)] disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? "저장 중..." : "확인"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

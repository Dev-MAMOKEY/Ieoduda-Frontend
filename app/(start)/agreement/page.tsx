"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/Button";
import { DesktopHeader } from "@/components/DesktopHeader";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import { agreeToHandoff } from "@/lib/api/plan";
import type { ConsentRequest } from "@/lib/api/plan-types";

const serviceGuideItems = [
  "사망이 안전하게 확인되면, 가족과 동료에게 필요한 일을 올바른 순서로 이메일로 전달합니다.",
  "비밀번호를 적지 마세요. 계정 이름, 자료 위치의 유형과 원하는 처리 결과만 작성합니다.",
];

const handoffGuideItems = [
  "지정 확인자 2명의 신고가 필요합니다.",
  "외부 법무·장례 파트너가 공식 증빙을 검토합니다.",
  "승인 후 7~30일의 취소 가능한 대기 기간을 거칩니다.",
  "이메일에는 민감 정보를 넣지 않고 보안 링크만 발송합니다.",
  "서비스가 실제 계정을 자동 삭제·이전하지 않습니다.",
];

type ConsentCardProps = {
  title: string;
  items: string[];
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ConsentCard({ title, items, checked, onChange }: ConsentCardProps) {
  return (
    <section className="flex w-full flex-col gap-[30px] rounded-[14px] bg-[#fbfafd] px-3 py-3">
      <h2 className="text-center text-[18px] font-bold leading-none text-[#43306d] md:text-[20px]">
        {title}
      </h2>
      <div className="flex flex-col gap-[26px] px-1">
        <ul className="list-disc space-y-1 pl-[19px] text-[13px] font-medium leading-normal text-[#584e4d] md:pl-[22px] md:text-[15px]">
          {items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <label className="flex cursor-pointer items-center gap-[14px] text-[13px] font-medium leading-none text-black md:text-[15px]">
          <span className="relative flex size-4 shrink-0 items-center justify-center md:size-[18px]">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => onChange(event.target.checked)}
              className="peer size-full cursor-pointer appearance-none rounded-full border border-[#584e4d] bg-transparent checked:border-[#43306d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden items-center justify-center peer-checked:flex"
            >
              <Image alt="" className="size-3" height={12} src="/icons/agreement/check.svg" width={12} />
            </span>
          </span>
          <span>위 내용을 이해했으며 동의합니다.</span>
        </label>
      </div>
    </section>
  );
}

export default function AgreementPage() {
  const router = useRouter();
  const [selections, setSelections] = useState<ConsentRequest>({
    serviceGuideAgreed: false,
    handoffGuideAgreed: false,
  });
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateSelection = (key: keyof ConsentRequest, checked: boolean) => {
    setSelections((current) => ({ ...current, [key]: checked }));
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    if (!selections.serviceGuideAgreed || !selections.handoffGuideAgreed) {
      setErrorMessage("두 안내 내용을 모두 확인하고 동의해 주세요.");
      return;
    }

    setPending(true);
    setErrorMessage("");

    try {
      await agreeToHandoff(selections);
      router.replace("/plan-info");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "동의 내용을 저장하지 못했습니다."));
      setPending(false);
    }
  };

  return (
    <AuthGuard>
      <main className="flex min-h-dvh w-full flex-col text-[#28292e]">
        <DesktopHeader authenticated />
        <form
          className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col px-6 pb-[34px] pt-6 md:min-h-0 md:max-w-[460px] md:flex-1 md:justify-center md:px-0 md:pb-[100px] md:pt-[50px]"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="flex flex-1 flex-col justify-between gap-6 md:flex-none md:gap-[50px]">
            <div className="flex flex-col gap-3">
              <PageHeader
                title="서비스 중요 안내 사항"
                className="h-[60px] shrink-0 items-center md:h-auto md:py-2"
              />
              <div className="flex flex-col gap-6">
                <ConsentCard
                  title="서비스 및 금지 정보 안내"
                  items={serviceGuideItems}
                  checked={selections.serviceGuideAgreed}
                  onChange={(checked) => updateSelection("serviceGuideAgreed", checked)}
                />
                <ConsentCard
                  title="실제 사후 인계 안내"
                  items={handoffGuideItems}
                  checked={selections.handoffGuideAgreed}
                  onChange={(checked) => updateSelection("handoffGuideAgreed", checked)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {errorMessage && (
                <p className="text-center text-xs text-red-700" role="alert">
                  {errorMessage}
                </p>
              )}
              <Button className="text-[14px] md:text-[16px]" disabled={pending} type="submit">
                {pending ? "저장 중..." : "확인"}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </AuthGuard>
  );
}

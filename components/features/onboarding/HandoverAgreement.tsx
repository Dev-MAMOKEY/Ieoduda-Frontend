"use client";

// 필수 동의 항목의 선택 상태를 관리하고 모두 동의하면 계획 홈으로 이동시킵니다.
import { useRouter } from "next/navigation";
import { useState } from "react";
import { conditionalActionClassName } from "@/components/shared/ui/actionStyles";

const agreements = [
  "지정 확인자 2명의 신고가 필요합니다.",
  "외부 법무･장례 파트너가 공식 증빙을 검토합니다.",
  "승인 후 7-30일의 취소 가능한 대기 기간을 거칩니다.",
  "이메일에는 민감내용을 넣지 않고 보안 링크만 발송합니다.",
  "서비스가 실제 계정을 자동 삭제･이전하지 않습니다.",
];

export function HandoverAgreement() {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean[]>(
    agreements.map(() => false),
  );
  const allChecked = checked.every(Boolean);

  const toggleAgreement = (index: number) => {
    setChecked((current) =>
      current.map((value, itemIndex) =>
        itemIndex === index ? !value : value,
      ),
    );
  };

  return (
    <article className="flex w-full max-w-[340px] flex-col items-center gap-[26px] overflow-hidden rounded-[30px] bg-white px-[30px] pb-[30px] pt-10 lg:max-w-[460px] lg:gap-10 lg:px-10">
      <div className="flex w-full flex-col items-center gap-[22px] lg:gap-[30px]">
        <h1 className="text-base font-bold text-[#28292e] lg:text-lg">
          사후 인계 안내 필수 동의
        </h1>
        <div className="flex w-full flex-col gap-[18px] lg:gap-5">
          {agreements.map((agreement, index) => (
            <label
              className="flex cursor-pointer items-center gap-[18px] text-sm font-medium leading-relaxed text-[#838383] lg:text-[15px]"
              key={agreement}
            >
              <input
                checked={checked[index]}
                className="peer sr-only"
                onChange={() => toggleAgreement(index)}
                type="checkbox"
              />
              <span className="relative size-[16px] shrink-0 rounded-[6px] border-2 border-[#a8a8a8] text-[11px] font-bold text-white after:absolute after:left-1/2 after:top-1/2 after:leading-none after:content-['✓'] after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 peer-checked:border-[#6e6e6e] peer-checked:bg-[#6e6e6e] peer-checked:after:opacity-100" />
              <span>{agreement}</span>
            </label>
          ))}
        </div>
      </div>
      <button
        className={conditionalActionClassName}
        disabled={!allChecked}
        onClick={() => router.push("/plan")}
        type="button"
      >
        확인하기
      </button>
    </article>
  );
}

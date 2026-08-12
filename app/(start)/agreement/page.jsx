"use client";

import { useState } from "react";

const agreements = [
  "지정 확인자 2명의 신고가 필요합니다.",
  "외부 법무･장례 파트너가 공식 증빙을 검토합니다.",
  "승인 후 7-30일의 취소 가능한 대기 기간을 거칩니다.",
  "이메일에는 민감내용을 넣지 않고 보안 링크만 발송합니다.",
  "서비스가 실제 계정을 자동 삭제･이전하지 않습니다.",
];

export default function AgreementPage() {
  const [checkedItems, setCheckedItems] = useState(
    agreements.map(() => false),
  );

  const allChecked = checkedItems.every(Boolean);

  const toggleAgreement = (index) => {
    setCheckedItems((current) =>
      current.map((checked, itemIndex) =>
        itemIndex === index ? !checked : checked,
      ),
    );
  };

  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center justify-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e]"
      data-node-id="439:1176"
    >
      <section
        className="flex w-full max-w-[340px] flex-col items-center gap-[26px] overflow-hidden rounded-[30px] bg-white px-[30px] pb-[30px] pt-10"
        data-node-id="439:1177"
      >
        <div className="flex w-full flex-col items-center gap-[22px]">
          <h1 className="text-base font-bold">사후 인계 안내 필수 동의</h1>

          <div className="flex w-full flex-col gap-[18px]">
            {agreements.map((agreement, index) => (
              <label
                className="flex cursor-pointer items-center gap-[18px] text-sm font-medium leading-[23px] text-[#838383]"
                key={agreement}
              >
                <input
                  checked={checkedItems[index]}
                  className="peer sr-only"
                  onChange={() => toggleAgreement(index)}
                  type="checkbox"
                />
                <span className="flex size-[14px] shrink-0 items-center justify-center rounded-full border-2 border-[#a8a8a8] text-[9px] text-white peer-checked:border-[#838383] peer-checked:bg-[#838383] peer-checked:after:content-['✓']" />
                <span>{agreement}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          className="flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors enabled:hover:bg-[#838383] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!allChecked}
          type="button"
        >
          시작하기
        </button>
      </section>
    </main>
  );
}

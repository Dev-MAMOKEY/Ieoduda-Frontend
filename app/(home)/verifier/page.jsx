"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { OutlineButton } from "@/components/OutlineButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const MAX_VERIFIERS = 5;

function VerifierFields({ index }) {
  const number = index + 1;

  return (
    <fieldset className="flex w-full flex-col gap-[18px] rounded-[20px] border border-[#d9d9d9] px-4 pb-5 pt-4">
      <legend className="px-2 text-sm font-bold text-[#838383]">
        확인자 {number}
      </legend>

      <FormField id={`verifier-name-${number}`} label="확인자 이름" name={`verifiers[${index}].name`} placeholder="이름을 입력해 주세요" type="text" autoComplete="name" />
      <FormField id={`verifier-email-${number}`} label="확인자 이메일" name={`verifiers[${index}].email`} placeholder="이메일을 입력해 주세요" type="email" autoComplete="email" />
    </fieldset>
  );
}

export default function VerifierPage() {
  const router = useRouter();
  const [verifiers, setVerifiers] = useState([0, 1]);
  const reachedLimit = verifiers.length >= MAX_VERIFIERS;

  const addVerifier = () => {
    setVerifiers((current) =>
      current.length >= MAX_VERIFIERS
        ? current
        : [...current, current.length],
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push("/life-area");
  };

  return (
    <PageContainer
      className="gap-[22px] py-[70px]"
      data-node-id="439:1562"
    >
      <PageHeader title="지정 확인자 등록" className="items-start pb-5" />

      <h2 className="text-base font-bold">등록할 확인자</h2>

      <form className="flex w-full flex-col gap-[22px]" onSubmit={handleSubmit}>
        {verifiers.map((verifier, index) => (
          <VerifierFields index={index} key={verifier} />
        ))}

        <Button type="submit">등록하기</Button>

        <OutlineButton
          disabled={reachedLimit}
          onClick={addVerifier}
          type="button"
        >
          <Image src="/icons/verifier/user-plus.svg" alt="" width={20} height={20} />
          확인자 등록하기
        </OutlineButton>
      </form>

      <p className="w-full text-center text-[13px] font-medium text-[#838383]">
        {reachedLimit
          ? "확인자는 최대 5명까지 등록할 수 있어요"
          : `현재 확인자 ${verifiers.length}명 · 최대 5명`}
      </p>

      <aside className="flex w-full flex-col items-start rounded-[20px] bg-[#d9d9d9] px-5 pb-5 pt-[18px]">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1.5">
            <Image src="/icons/verifier/check-circle.svg" alt="" width={22} height={22} />
            <h2 className="text-sm font-bold">확인자가 맡는 일</h2>
          </div>
          <p className="text-xs font-medium leading-[18px] text-[#838383]">
            나중에 다른 확인자와 함께 사망 사실을 확인해 달라는 요청을 받게 되고,
            두 사람의 확인이 모이면 계획이 시작돼요. 안내는 수락요청 메일에도 함께 전달돼요.
          </p>
        </div>
      </aside>
    </PageContainer>
  );
}

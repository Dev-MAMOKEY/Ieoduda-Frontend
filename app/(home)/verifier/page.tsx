// 지정확인자 입력 목록을 관리하고 서버에 한 번에 등록하는 화면입니다.

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { OutlineButton } from "@/components/OutlineButton";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import { getMyPlan, registerConfirmers } from "@/lib/api/plan";

const MAX_VERIFIERS = 5;

function VerifierFields({ index }: { index: number }) {
  const number = index + 1;

  return (
    <fieldset className="flex w-full flex-col gap-[18px] rounded-[20px] border border-[#d9d9d9] px-4 pb-5 pt-4">
      <legend className="px-2 text-sm font-bold text-[#838383]">
        확인자 {number}
      </legend>

      <FormField
        id={`verifier-name-${number}`}
        label="확인자 이름"
        name={`verifiers[${index}].name`}
        placeholder="이름을 입력해 주세요"
        type="text"
        autoComplete="name"
      />
      <FormField
        id={`verifier-email-${number}`}
        label="확인자 이메일"
        name={`verifiers[${index}].email`}
        placeholder="이메일을 입력해 주세요"
        type="email"
        autoComplete="email"
      />
    </fieldset>
  );
}

export default function VerifierPage() {
  const router = useRouter();
  const [verifiers, setVerifiers] = useState([0, 1]);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const reachedLimit = verifiers.length >= MAX_VERIFIERS;

  const addVerifier = () => {
    setVerifiers((current) =>
      current.length >= MAX_VERIFIERS ? current : [...current, current.length],
    );
  };

  // 동적으로 생성된 폼 값을 모아 Swagger의 confirmers 배열 형태로 전송합니다.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setErrorMessage("");
    const formData = new FormData(event.currentTarget);
    const confirmers = verifiers.map((_, index) => ({
      name: String(formData.get(`verifiers[${index}].name`) ?? "").trim(),
      email: String(formData.get(`verifiers[${index}].email`) ?? "").trim(),
    }));
    if (confirmers.some((person) => !person.name || !person.email)) {
      setErrorMessage("모든 지정확인자의 이름과 이메일을 입력해 주세요.");
      setPending(false);
      return;
    }
    try {
      const plan = await getMyPlan();
      await registerConfirmers(plan.planId, confirmers);
      router.push("/life-area");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "지정확인자를 등록하지 못했습니다."));
      setPending(false);
    }
  };

  return (
    <PageContainer className="gap-[22px] py-[70px]" data-node-id="439:1562">
      <PageHeader title="지정 확인자 등록" className="items-start pb-5" />

      <h2 className="text-base font-bold">등록할 확인자</h2>

      <form className="flex w-full flex-col gap-[22px]" onSubmit={handleSubmit}>
        {verifiers.map((verifier, index) => (
          <VerifierFields index={index} key={verifier} />
        ))}

        {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
        <Button disabled={pending} type="submit">{pending ? "등록 중..." : "등록하기"}</Button>

        <OutlineButton
          disabled={reachedLimit}
          onClick={addVerifier}
          type="button"
        >
          <Image
            src="/icons/verifier/user-plus.svg"
            alt=""
            width={20}
            height={20}
          />
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
            <Image
              src="/icons/verifier/check-circle.svg"
              alt=""
              width={22}
              height={22}
            />
            <h2 className="text-sm font-bold">확인자가 맡는 일</h2>
          </div>
          <p className="text-xs font-medium leading-[18px] text-[#838383]">
            나중에 다른 확인자와 함께 사망 사실을 확인해 달라는 요청을 받게
            되고, 두 사람의 확인이 모이면 계획이 시작돼요. 안내는 수락요청
            메일에도 함께 전달돼요.
          </p>
        </div>
      </aside>
    </PageContainer>
  );
}

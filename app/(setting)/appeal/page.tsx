"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const inputClass =
  "min-h-[48px] w-full rounded-[14px] border bg-white px-4 py-[14px] text-[13px] font-medium leading-none text-[#584e4d] outline-none placeholder:text-[#a99d9e] focus-visible:ring-2 focus-visible:ring-[#43306d]/25 md:px-5 md:py-4 md:text-[15px]";
type FieldName = "selfEmail" | "contactName" | "contactEmail" | "waitingPeriod";
type FieldErrors = Partial<Record<FieldName, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="flex flex-col gap-4 rounded-[16px] bg-[#f3f3ff] px-5 pb-[22px] pt-[18px] md:rounded-[20px] md:pb-6 md:pt-5">
      <div className="flex flex-col gap-1 md:gap-2.5">
        <Image
          alt=""
          width={22}
          height={22}
          src="/icons/settings/warning-circle.svg"
        />
        <h2 className="text-sm font-bold text-[#43306d] md:text-base">{title}</h2>
      </div>
      <div className="text-xs font-medium leading-normal text-[#796b6c] md:text-sm">
        {children}
      </div>
    </aside>
  );
}

export default function AppealPage() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [selfVerified, setSelfVerified] = useState(false);

  const clearError = (name: FieldName) => {
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleVerifyEmail = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    const email = String(new FormData(form ?? undefined).get("selfEmail") ?? "").trim();
    if (!email) {
      setFieldErrors((current) => ({ ...current, selfEmail: "본인 이메일을 입력해 주세요." }));
      setSelfVerified(false);
      return;
    }
    if (!emailPattern.test(email)) {
      setFieldErrors((current) => ({ ...current, selfEmail: "올바른 이메일 형식으로 입력해 주세요." }));
      setSelfVerified(false);
      return;
    }
    clearError("selfEmail");
    setSelfVerified(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const selfEmail = String(data.get("selfEmail") ?? "").trim();
    const contactName = String(data.get("contactName") ?? "").trim();
    const contactEmail = String(data.get("contactEmail") ?? "").trim();
    const waitingValue = String(data.get("waitingPeriod") ?? "").trim();
    const waitingPeriod = Number(waitingValue);
    const errors: FieldErrors = {};

    if (!selfEmail) errors.selfEmail = "본인 이메일을 입력해 주세요.";
    else if (!emailPattern.test(selfEmail)) errors.selfEmail = "올바른 이메일 형식으로 입력해 주세요.";
    else if (!selfVerified) errors.selfEmail = "먼저 검증 메일을 보내 주세요.";
    if (!contactName) errors.contactName = "이의 제기 연락처의 이름을 입력해 주세요.";
    if (!contactEmail) errors.contactEmail = "이의 제기 연락처의 이메일을 입력해 주세요.";
    else if (!emailPattern.test(contactEmail)) errors.contactEmail = "올바른 이메일 형식으로 입력해 주세요.";
    if (!waitingValue) errors.waitingPeriod = "대기 기간을 입력해 주세요.";
    else if (!Number.isInteger(waitingPeriod) || waitingPeriod < 7 || waitingPeriod > 30) {
      errors.waitingPeriod = "대기 기간은 7~30일 사이의 정수로 입력해 주세요.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) router.push("/appeal/edit");
  };

  return (
    <PageContainer
      className="gap-0 pb-9 pt-[70px] md:min-h-[calc(100dvh-125px)] md:max-w-none md:px-[120px] md:pb-20 md:pt-0"
      data-node-id="439:3813"
    >
      <PageHeader
        backHref="/profile"
        backLabel="설정 화면으로 돌아가기"
        className="md:hidden"
        title="대기 이의제기"
      />
      <PageHeader className="hidden md:flex" title="대기 이의제기" />
      <div className="mx-auto flex w-full max-w-[342px] flex-col gap-5 pt-5 md:max-w-[460px] md:gap-10 md:pt-[50px]">
        <form className="contents" noValidate onSubmit={handleSubmit}>
        <section className="flex flex-col gap-6 md:gap-[22px] md:pb-[22px]">
          <div className="flex flex-col gap-3.5 md:gap-[22px] md:pb-[14px]">
            <div className="flex justify-between">
              <h2 className="text-base font-bold text-[#43306d] md:text-lg">본인 경고 이메일</h2>
              <span className="text-sm font-bold text-[#796b6c] md:text-base">{selfVerified ? "검증 완료" : "검증 필요"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <input aria-invalid={Boolean(fieldErrors.selfEmail)} className={`${inputClass} ${fieldErrors.selfEmail ? "border-red-500" : "border-transparent"}`} name="selfEmail" onChange={() => { clearError("selfEmail"); setSelfVerified(false); }} placeholder="이메일을 입력해 주세요" type="email" />
              {fieldErrors.selfEmail && <p className="px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.selfEmail}</p>}
            </div>
          </div>
          <Button className="cursor-pointer text-sm hover:!bg-[#37275a] md:text-base" onClick={handleVerifyEmail} type="button">
            검증 메일 보내기
          </Button>
        </section>
        <section className="flex flex-col gap-6 pb-3 md:gap-6 md:pb-[14px]">
          <div className="flex flex-col gap-[22px]">
            <div className="flex flex-col gap-3.5 md:gap-[22px]">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#43306d] md:text-lg">이의 제기 연락처</h2>
                <span className="text-sm font-bold text-[#796b6c] md:text-base">검증 필요</span>
              </div>
              <div className="flex flex-col gap-2"><input aria-invalid={Boolean(fieldErrors.contactName)} className={`${inputClass} ${fieldErrors.contactName ? "border-red-500" : "border-transparent"}`} name="contactName" onChange={() => clearError("contactName")} placeholder="이름을 입력해 주세요" />{fieldErrors.contactName && <p className="px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.contactName}</p>}</div>
              <div className="flex flex-col gap-2"><input aria-invalid={Boolean(fieldErrors.contactEmail)} className={`${inputClass} ${fieldErrors.contactEmail ? "border-red-500" : "border-transparent"}`} name="contactEmail" onChange={() => clearError("contactEmail")} placeholder="이메일을 입력해 주세요" type="email" />{fieldErrors.contactEmail && <p className="px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.contactEmail}</p>}</div>
            </div>
            <div className="flex flex-col gap-3.5 md:gap-[22px]">
              <h2 className="text-base font-bold text-[#43306d] md:text-lg">대기 기간</h2>
              <div className="flex flex-col gap-2"><input aria-invalid={Boolean(fieldErrors.waitingPeriod)} className={`${inputClass} ${fieldErrors.waitingPeriod ? "border-red-500" : "border-transparent"}`} inputMode="numeric" max={30} min={7} name="waitingPeriod" onChange={() => clearError("waitingPeriod")} placeholder="대기 기간을 입력해 주세요 (7-30일)" step={1} type="number" />{fieldErrors.waitingPeriod && <p className="px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.waitingPeriod}</p>}</div>
            </div>
          </div>
        </section>
        <Button className="cursor-pointer text-sm hover:!bg-[#37275a] md:bg-[#7f62b8] md:text-base md:hover:!bg-[#765aaa]" type="submit">
          <span className="md:hidden">대기 이의제기 보내기</span>
          <span className="hidden md:inline">대기 이의제기 등록하기</span>
        </Button>
        </form>
        <div className="flex flex-col gap-[22px]">
          <Notice title="취소 절차 안내">
            <div className="flex flex-col gap-1">
              <p>실행 신호가 오면, 먼저 본인에게 경고 메일이 가요.</p>
              <p>대기 기간 동안 본인·이의 제기 연락처가 취소할 수 있어요.</p>
            </div>
            <div className="mt-4 flex flex-col gap-2.5 md:mt-4 md:gap-2">
              <div className="flex flex-col gap-1 pl-0.5">
                <strong className="font-semibold text-[#43306d] md:hidden">본인</strong>
                <p>
                  <span className="md:hidden">실행 직전 보내드리는 경고 메일의 ‘멈추기’를 누르면 중단돼요.</span>
                  <span className="hidden md:inline">본인 / 이의 제기 연락처</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 pl-0.5">
                <strong className="font-semibold text-[#43306d] md:hidden">
                  이의 제기 연락처
                </strong>
                <p><span className="md:hidden">등록된 분도 대기 기간 동안 이의를 제기해 멈출 수 있어요.</span><span className="hidden md:inline">실행 직전 보내드리는 경고 메일의 ‘멈추기’를 누르면 중단돼요. / 등록된 분도 대기 기간 동안 이의를 제기해 멈출 수 있어요.</span></p>
              </div>
            </div>
          </Notice>
          <Notice title="분쟁 시 자동 중지 안내">
            <p>
              이의나 분쟁이 접수되면 계획은 자동으로 멈추고, 실행되지 않아요.
            </p>
            <p>
              대기 기간이 끝나도 진행되지 않고, 문제가 확인·해결될 때까지 그대로
              멈춰 있어요.
            </p>
          </Notice>
        </div>
      </div>
    </PageContainer>
  );
}

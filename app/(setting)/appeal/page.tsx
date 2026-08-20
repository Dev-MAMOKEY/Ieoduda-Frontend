"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { ActionFeedback } from "@/components/ActionFeedback";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import {
  getMyPlan,
  getReleaseSettings,
  registerDisputeContact,
  registerSelfWarningEmail,
  resendDisputeContactVerificationEmail,
  updateDisputeContact,
  updateReleasePolicy,
} from "@/lib/api/plan";
import type { ApiId } from "@/lib/api/plan-types";
import { showSnackbarAfterNavigation } from "@/lib/ui/snackbar";

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
  const [selfEmail, setSelfEmail] = useState("");
  const [planId, setPlanId] = useState<ApiId | null>(null);
  const [contactId, setContactId] = useState<ApiId | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactVerified, setContactVerified] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [contactVerificationPending, setContactVerificationPending] = useState(false);
  const [contactVerificationMessage, setContactVerificationMessage] = useState("");
  const [submissionPending, setSubmissionPending] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [settingsLoadError, setSettingsLoadError] = useState("");

  useEffect(() => {
    getMyPlan()
      .then(async (plan) => {
        setPlanId(plan.planId);
        const settings = await getReleaseSettings(plan.planId);
        setSelfEmail(settings.selfWarningEmail ?? "");
        setSelfVerified(settings.selfWarningEmailVerified);
        setContactId(settings.disputeContact?.contactId ?? null);
        setContactName(settings.disputeContact?.name ?? "");
        setContactEmail(settings.disputeContact?.email ?? "");
        setContactVerified(settings.disputeContact?.verified ?? false);
      })
      .catch((error: unknown) => {
        setSettingsLoadError(getApiErrorMessage(error, "기존 대기·이의제기 정보를 불러오지 못했습니다. 입력하기 전에 잠시 후 다시 확인해 주세요."));
      });
  }, []);

  const clearError = (name: FieldName) => {
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleVerifyContactEmail = async (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;
    const data = new FormData(form ?? undefined);
    const name = String(data.get("contactName") ?? "").trim();
    const email = String(data.get("contactEmail") ?? "").trim();
    const errors: FieldErrors = {};

    if (!name) errors.contactName = "이의 제기 연락처의 이름을 입력해 주세요.";
    if (!email) errors.contactEmail = "이의 제기 연락처의 이메일을 입력해 주세요.";
    else if (!emailPattern.test(email)) errors.contactEmail = "올바른 이메일 형식으로 입력해 주세요.";

    setFieldErrors((current) => ({ ...current, ...errors }));
    if (Object.keys(errors).length > 0) {
      setContactVerified(false);
      return;
    }

    setContactVerificationPending(true);
    setContactVerificationMessage("");
    try {
      const currentPlanId = planId ?? (await getMyPlan()).planId;
      setPlanId(currentPlanId);
      const settings = await getReleaseSettings(currentPlanId);
      const currentContact = settings.disputeContact;
      const isSameContact = currentContact?.name === name
        && currentContact.email.toLowerCase() === email.toLowerCase();

      if (currentContact && isSameContact) {
        await resendDisputeContactVerificationEmail(currentContact.contactId);
        setContactId(currentContact.contactId);
      } else {
        const result = currentContact
          ? await updateDisputeContact(currentPlanId, currentContact.contactId, name, email)
          : await registerDisputeContact(currentPlanId, name, email);
        setContactId(result.contactId ?? currentContact?.contactId ?? null);
      }

      setContactName(name);
      setContactEmail(email);
      setContactVerified(false);
      setContactVerificationMessage("검증 메일을 보냈어요. 이메일의 링크를 눌러 검증을 완료해 주세요.");
    } catch (error) {
      setContactVerified(false);
      setContactVerificationMessage(getApiErrorMessage(error, "검증 메일을 보내지 못했습니다."));
    } finally {
      setContactVerificationPending(false);
    }
  };

  const handleVerifyEmail = async (event: MouseEvent<HTMLButtonElement>) => {
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
    setVerificationPending(true);
    setVerificationMessage("");
    try {
      const currentPlanId = planId ?? (await getMyPlan()).planId;
      setPlanId(currentPlanId);
      const result = await registerSelfWarningEmail(currentPlanId, email);
      setSelfEmail(result.email);
      setSelfVerified(result.verified);
      setVerificationMessage(result.emailSent
        ? "검증 메일을 보냈어요. 이메일의 링크를 눌러 검증을 완료해 주세요."
        : "이메일을 등록했지만 검증 메일 발송 여부를 확인하지 못했어요.");
    } catch (error) {
      setSelfVerified(false);
      setVerificationMessage(getApiErrorMessage(error, "검증 메일을 보내지 못했습니다."));
    } finally {
      setVerificationPending(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    if (!contactName) errors.contactName = "이의 제기 연락처의 이름을 입력해 주세요.";
    if (!contactEmail) errors.contactEmail = "이의 제기 연락처의 이메일을 입력해 주세요.";
    else if (!emailPattern.test(contactEmail)) errors.contactEmail = "올바른 이메일 형식으로 입력해 주세요.";
    if (!waitingValue) errors.waitingPeriod = "대기 기간을 입력해 주세요.";
    else if (!Number.isInteger(waitingPeriod) || waitingPeriod < 7 || waitingPeriod > 30) {
      errors.waitingPeriod = "대기 기간은 7~30일 사이의 정수로 입력해 주세요.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmissionPending(true);
    setSubmissionMessage("");
    try {
      const currentPlanId = planId ?? (await getMyPlan()).planId;
      setPlanId(currentPlanId);
      const latestSettings = await getReleaseSettings(currentPlanId);
      const registeredEmail = latestSettings.selfWarningEmail?.trim().toLowerCase() ?? "";
      const emailVerified = latestSettings.selfWarningEmailVerified
        && registeredEmail === selfEmail.toLowerCase();

      setSelfVerified(emailVerified);
      if (!emailVerified) {
        setFieldErrors((current) => ({
          ...current,
          selfEmail: "본인 경고 이메일의 검증 링크를 눌러 확인을 완료해 주세요.",
        }));
        setVerificationMessage("이메일 확인이 완료된 후 다시 등록해 주세요.");
        setSubmissionPending(false);
        return;
      }

      const registeredContact = latestSettings.disputeContact;
      const contactMatches = registeredContact?.name === contactName
        && registeredContact.email.trim().toLowerCase() === contactEmail.toLowerCase();
      const isContactVerified = registeredContact?.verified === true && contactMatches;

      setContactVerified(isContactVerified);
      if (!isContactVerified) {
        setFieldErrors((current) => ({
          ...current,
          contactEmail: registeredContact?.verified
            ? "검증한 이의 제기 연락처와 현재 입력값이 달라요. 검증 메일을 다시 보내 주세요."
            : "이의 제기 연락처 이메일의 검증 링크를 눌러 확인을 완료해 주세요.",
        }));
        setContactVerificationMessage("이메일 확인이 완료된 후 다시 등록해 주세요.");
        setSubmissionPending(false);
        return;
      }

      const latestContactId = registeredContact.contactId ?? contactId;
      setContactId(latestContactId);
      await updateReleasePolicy(currentPlanId, waitingPeriod);
      showSnackbarAfterNavigation("대기·이의제기 설정이 저장되었습니다.");
      router.push("/appeal/edit");
    } catch (error) {
      setSubmissionMessage(getApiErrorMessage(error, "대기 이의제기 정보를 저장하지 못했습니다."));
      setSubmissionPending(false);
    }
  };

  return (
    <PageContainer
      className="gap-0 pb-9 pt-[70px] md:min-h-[calc(100dvh-125px)] md:max-w-none md:px-[120px] md:pb-20 md:pt-0"
      data-node-id="439:3813"
    >
      <PageHeader
        backHref="/profile"
        backLabel="설정 화면으로 돌아가기"
        className="mx-auto max-w-[342px] md:max-w-[460px]"
        title="대기 이의제기"
      />
      <div className="mx-auto flex w-full max-w-[342px] flex-col gap-5 pt-5 md:max-w-[460px] md:gap-10 md:pt-[50px]">
        {settingsLoadError ? <ActionFeedback tone="error">{settingsLoadError}</ActionFeedback> : null}
        <form className="contents" noValidate onSubmit={handleSubmit}>
        <section className="flex flex-col gap-6 md:gap-[22px] md:pb-[22px]">
          <div className="flex flex-col gap-3.5 md:gap-[22px] md:pb-[14px]">
            <div className="flex justify-between">
              <h2 className="text-base font-bold text-[#43306d] md:text-lg">본인 경고 이메일</h2>
              <span className="text-sm font-bold text-[#796b6c] md:text-base">{selfVerified ? "검증 완료" : "검증 필요"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <input aria-invalid={Boolean(fieldErrors.selfEmail)} className={`${inputClass} ${fieldErrors.selfEmail ? "border-red-500" : "border-transparent"}`} name="selfEmail" onChange={(event) => { setSelfEmail(event.target.value); clearError("selfEmail"); setSelfVerified(false); setVerificationMessage(""); }} placeholder="이메일을 입력해 주세요" type="email" value={selfEmail} />
              {fieldErrors.selfEmail && <p className="form-field-error px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.selfEmail}</p>}
              {verificationMessage && <p className="px-2.5 text-xs font-medium text-[#796b6c]" role="status">{verificationMessage}</p>}
            </div>
          </div>
          <Button className="cursor-pointer text-sm hover:!bg-[#37275a] md:text-base" disabled={verificationPending} onClick={handleVerifyEmail} type="button">
            {verificationPending ? "검증 메일 보내는 중..." : "검증 메일 보내기"}
          </Button>
        </section>
        <section className="flex flex-col gap-6 pb-3 md:gap-6 md:pb-[14px]">
          <div className="flex flex-col gap-[22px]">
            <div className="flex flex-col gap-3.5 md:gap-[22px]">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#43306d] md:text-lg">이의 제기 연락처</h2>
                <span className="text-sm font-bold text-[#796b6c] md:text-base">{contactVerified ? "검증 완료" : "검증 필요"}</span>
              </div>
              <div className="flex flex-col gap-2"><input aria-invalid={Boolean(fieldErrors.contactName)} className={`${inputClass} ${fieldErrors.contactName ? "border-red-500" : "border-transparent"}`} name="contactName" onChange={(event) => { setContactName(event.target.value); clearError("contactName"); setContactVerified(false); setContactVerificationMessage(""); }} placeholder="이름을 입력해 주세요" value={contactName} />{fieldErrors.contactName && <p className="form-field-error px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.contactName}</p>}</div>
              <div className="flex flex-col gap-2"><input aria-invalid={Boolean(fieldErrors.contactEmail)} className={`${inputClass} ${fieldErrors.contactEmail ? "border-red-500" : "border-transparent"}`} name="contactEmail" onChange={(event) => { setContactEmail(event.target.value); clearError("contactEmail"); setContactVerified(false); setContactVerificationMessage(""); }} placeholder="이메일을 입력해 주세요" type="email" value={contactEmail} />{fieldErrors.contactEmail && <p className="form-field-error px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.contactEmail}</p>}{contactVerificationMessage && <p className="px-2.5 text-xs font-medium text-[#796b6c]" role="status">{contactVerificationMessage}</p>}</div>
            </div>
            <Button className="cursor-pointer text-sm hover:!bg-[#37275a] md:text-base" disabled={contactVerificationPending || contactVerified} onClick={handleVerifyContactEmail} type="button">
              {contactVerificationPending ? "검증 메일 보내는 중..." : contactVerified ? "검증 완료" : "검증 메일 보내기"}
            </Button>
            <div className="flex flex-col gap-3.5 md:gap-[22px]">
              <h2 className="text-base font-bold text-[#43306d] md:text-lg">대기 기간</h2>
              <div className="flex flex-col gap-2"><input aria-invalid={Boolean(fieldErrors.waitingPeriod)} className={`${inputClass} ${fieldErrors.waitingPeriod ? "border-red-500" : "border-transparent"}`} inputMode="numeric" max={30} min={7} name="waitingPeriod" onChange={() => clearError("waitingPeriod")} placeholder="대기 기간을 입력해 주세요 (7-30일)" step={1} type="number" />{fieldErrors.waitingPeriod && <p className="form-field-error px-2.5 text-xs font-medium text-red-600" role="alert">{fieldErrors.waitingPeriod}</p>}</div>
            </div>
          </div>
        </section>
        {submissionMessage && <p className="text-center text-sm text-red-700" role="alert">{submissionMessage}</p>}
        <Button className="cursor-pointer !bg-[#7f62b8] text-sm hover:!bg-[#765aaa] md:text-base" disabled={submissionPending || verificationPending || contactVerificationPending} type="submit">
          {submissionPending ? "등록 중..." : "대기 이의제기 등록하기"}
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

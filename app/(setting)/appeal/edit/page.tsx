"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage } from "@/lib/api/auth";
import { getMyPlan, getReleaseSettings, registerDisputeContact, updateDisputeContact, updateReleasePolicy } from "@/lib/api/plan";
import type { ApiId } from "@/lib/api/plan-types";

type FieldName = "contactName" | "contactEmail" | "waitingDays";
type FieldErrors = Partial<Record<FieldName, string>>;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AppealEditPage() {
  const router = useRouter();
  const [planId, setPlanId] = useState<ApiId | null>(null);
  const [contactId, setContactId] = useState<ApiId | null>(null);
  const [selfEmail, setSelfEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [waitingDays, setWaitingDays] = useState("");
  const [selfEmailVerified, setSelfEmailVerified] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let active = true;
    getMyPlan()
      .then(async (plan) => {
        const settings = await getReleaseSettings(plan.planId);
        if (!active) return;
        const warningEmail = settings.selfWarningEmail ?? "";
        setPlanId(plan.planId);
        setContactId(settings.disputeContact?.contactId ?? null);
        setSelfEmail(warningEmail);
        setSelfEmailVerified(settings.selfWarningEmailVerified);
        setContactName(settings.disputeContact?.name ?? "");
        setContactEmail(settings.disputeContact?.email ?? "");
        setWaitingDays(settings.waitingDays == null ? "" : String(settings.waitingDays));
      })
      .catch((error: unknown) => active && setLoadError(getApiErrorMessage(error, "대기·이의제기 정보를 불러오지 못했습니다.")))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const clearError = (name: FieldName) => {
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setSaveMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextContactName = contactName.trim();
    const nextContactEmail = contactEmail.trim();
    const nextWaitingDays = Number(waitingDays);
    const errors: FieldErrors = {};

    if (!nextContactName) errors.contactName = "이의제기 연락처의 이름을 입력해 주세요.";
    if (!nextContactEmail) errors.contactEmail = "이의제기 연락처의 이메일을 입력해 주세요.";
    else if (!emailPattern.test(nextContactEmail)) errors.contactEmail = "올바른 이메일 형식으로 입력해 주세요.";
    if (!waitingDays) errors.waitingDays = "대기기간을 입력해 주세요.";
    else if (!Number.isInteger(nextWaitingDays) || nextWaitingDays < 7 || nextWaitingDays > 30) errors.waitingDays = "대기기간은 7~30일 사이의 정수로 입력해 주세요.";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0 || planId == null) return;

    setSaving(true);
    setSaveMessage("");
    try {
      const requests: Promise<unknown>[] = [
        contactId == null
          ? registerDisputeContact(planId, nextContactName, nextContactEmail)
          : updateDisputeContact(planId, contactId, nextContactName, nextContactEmail),
        updateReleasePolicy(planId, nextWaitingDays),
      ];
      await Promise.all(requests);

      const refreshed = await getReleaseSettings(planId);
      setContactId(refreshed.disputeContact?.contactId ?? contactId);
      setSelfEmail(refreshed.selfWarningEmail ?? "");
      setSelfEmailVerified(refreshed.selfWarningEmailVerified);
      setContactName(refreshed.disputeContact?.name ?? nextContactName);
      setContactEmail(refreshed.disputeContact?.email ?? nextContactEmail);
      setWaitingDays(String(refreshed.waitingDays ?? nextWaitingDays));
      setSaveMessage("대기·이의제기 정보를 수정했습니다.");
      router.refresh();
    } catch (error) {
      setSaveMessage(getApiErrorMessage(error, "대기·이의제기 정보를 수정하지 못했습니다."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer className="gap-0 pb-9 pt-[70px] md:min-h-[calc(100dvh-125px)] md:max-w-none md:px-[120px] md:pb-20 md:pt-0" data-node-id="525:3186">
      <PageHeader backHref="/profile" title="대기·이의제기 수정" />
      <div className="mx-auto flex w-full max-w-[342px] flex-col pt-5 md:max-w-[460px] md:pt-[50px]">
        {loading ? (
          <p className="py-10 text-center text-sm font-medium text-[#796b6c]" role="status">정보를 불러오는 중입니다.</p>
        ) : loadError ? (
          <div className="flex flex-col gap-5">
            <p className="rounded-[14px] bg-red-50 px-5 py-4 text-sm text-red-700" role="alert">{loadError}</p>
            <Button href="/profile">돌아가기</Button>
          </div>
        ) : (
          <form className="flex flex-col gap-6 md:gap-8" noValidate onSubmit={handleSubmit}>
            <section className="flex flex-col gap-5 rounded-[20px] bg-white px-5 py-6 md:gap-6 md:px-6 md:py-7">
              <div className="flex flex-col gap-2">
                <FormField aria-readonly="true" id="selfEmail" label="본인 경고 이메일" readOnly type="email" value={selfEmail || "미등록"} />
                <p className="px-2.5 text-xs font-medium text-[#796b6c]">
                  {selfEmailVerified ? "인증이 완료된 이메일입니다." : "본인 경고 이메일은 이 화면에서 수정할 수 없습니다."}
                </p>
              </div>
              <FormField autoComplete="name" error={fieldErrors.contactName} id="contactName" label="이의제기 연락처 이름" onChange={(event) => { setContactName(event.target.value); clearError("contactName"); }} value={contactName} />
              <FormField autoComplete="email" error={fieldErrors.contactEmail} id="contactEmail" label="이의제기 연락처 이메일" onChange={(event) => { setContactEmail(event.target.value); clearError("contactEmail"); }} type="email" value={contactEmail} />
              <FormField error={fieldErrors.waitingDays} id="waitingDays" inputMode="numeric" label="대기기간" max={30} min={7} onChange={(event) => { setWaitingDays(event.target.value); clearError("waitingDays"); }} placeholder="7~30일" step={1} type="number" value={waitingDays} />
            </section>
            {saveMessage ? <p className={`text-center text-sm font-medium ${saveMessage.includes("못했습니다") ? "text-red-700" : "text-[#43306d]"}`} role="status">{saveMessage}</p> : null}
            <Button className="cursor-pointer !bg-[#7f62b8] hover:!bg-[#765aaa]" disabled={saving} type="submit">{saving ? "수정 중..." : "수정하기"}</Button>
          </form>
        )}
      </div>
    </PageContainer>
  );
}

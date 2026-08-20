"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { getApiErrorMessage, getConfirmerDetail, getMyPlan, updateConfirmer } from "@/lib/api";
import { showSnackbarAfterNavigation } from "@/lib/ui/snackbar";

type FieldErrors = Partial<Record<"name" | "email", string>>;

function EditVerifierContent() {
  const router = useRouter();
  const confirmId = useSearchParams().get("id");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!confirmId) { queueMicrotask(() => { setErrorMessage("수정할 확인자 정보가 없습니다."); setLoading(false); }); return; }
    let active = true;
    getMyPlan()
      .then((plan) => getConfirmerDetail(plan.planId, confirmId))
      .then((detail) => { if (active) { setName(detail.name); setEmail(detail.email); } })
      .catch((error) => active && setErrorMessage(getApiErrorMessage(error, "확인자 정보를 불러오지 못했습니다.")))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [confirmId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!confirmId || pending) return;
    const nextName = name.trim();
    const nextEmail = email.trim();
    const nextErrors: FieldErrors = {};

    if (!nextName) nextErrors.name = "확인자 이름을 입력해 주세요.";
    if (!nextEmail) nextErrors.email = "확인자 이메일을 입력해 주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
      nextErrors.email = "올바른 이메일 형식으로 입력해 주세요.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setPending(true); setErrorMessage("");
    try {
      const plan = await getMyPlan();
      await updateConfirmer(plan.planId, confirmId, nextName, nextEmail);
      showSnackbarAfterNavigation("확인자 정보가 수정되었습니다.");
      router.push(`/role?person=${encodeURIComponent(confirmId)}`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "확인자 정보를 수정하지 못했습니다."));
      setPending(false);
    }
  };

  return (
    <PageContainer
      className="gap-[22px] py-[70px] md:min-h-[calc(100dvh-125px)] md:max-w-none md:gap-10 md:px-[120px] md:pb-[50px] md:pt-0"
      data-node-id="522:2623"
    >
      <PageHeader
        backHref="/role?person=jimin"
        backLabel="역할별 패키지 미리보기로 돌아가기"
        className="pb-5 md:mx-auto md:max-w-[460px] md:pb-0"
        title="지정 확인자 수정"
      />
      <form
        className="mx-auto flex w-full flex-col gap-[22px] md:max-w-[460px]"
        noValidate
        onChange={(event) => {
          if (!(event.target instanceof HTMLInputElement)) return;
          const fieldName = event.target.name as keyof FieldErrors;
          if (!fieldErrors[fieldName]) return;
          setFieldErrors((current) => ({ ...current, [fieldName]: undefined }));
        }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-base font-bold md:text-lg">지정 확인자</h2>
        {errorMessage && <p className="text-sm text-red-600" role="alert">{errorMessage}</p>}
        <FormField
          autoComplete="name"
          id="verifier-name"
          label="확인자 이름"
          error={fieldErrors.name}
          maxLength={50}
          name="name"
          placeholder="이름을 입력해 주세요"
          required
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading || pending}
        />
        <FormField
          autoComplete="email"
          id="verifier-email"
          label="확인자 이메일"
          error={fieldErrors.email}
          maxLength={254}
          name="email"
          placeholder="이메일을 입력해 주세요"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading || pending}
        />
        <Button className="mt-[18px] md:h-[52px]" disabled={loading || pending || !confirmId} type="submit">
          {loading ? "불러오는 중..." : pending ? "수정 중..." : "수정하기"}
        </Button>
      </form>
    </PageContainer>
  );
}

export default function EditVerifierPage() {
  return <Suspense fallback={null}><EditVerifierContent /></Suspense>;
}

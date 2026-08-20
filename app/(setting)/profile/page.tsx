"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ForwardCaret } from "@/components/ForwardCaret";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { UserProfileSummary } from "@/components/UserProfileSummary";
import { BottomTabBar } from "@/components/BottomTabBar";
import type { ReactNode } from "react";
import { deactivatePlan, getApiErrorMessage, getMyPlan, getReleaseSettings, sealPackage } from "@/lib/api";
import { deleteCurrentUser } from "@/lib/api/user";
import { clearAllStoredConversationIds } from "@/lib/api/conversation-storage";
import { clearTokens } from "@/lib/api/token-storage";
import { logout } from "@/lib/api/auth";
import { showSnackbar, showSnackbarAfterNavigation } from "@/lib/ui/snackbar";

const plans = [
  { label: "계획 봉인하기" },
  { label: "담당자 수락", href: "/role?type=manager" },
  { label: "확인자 수락", href: "/role?type=verifier" },
  { label: "대기 이의제기" },
];
const cleanup = [
  {
    label: "계획 비활성화",
    description: "실행만 멈춰요. 데이터는 남고 언제든 다시 켤 수 있어요",
  },
  {
    label: "계정 삭제",
    description: (
      <>
        계정·모든 계획이 영구 삭제돼요
        <br />
        담당자·확인자에겐 역할 해제가 안내돼요. 되돌릴 수 없어요
      </>
    ),
  },
];

function Row({
  label,
  value = undefined,
  description = undefined,
  href = undefined,
  disabled = false,
  onClick = undefined,
}: { label: string; value?: string; description?: ReactNode; href?: string; disabled?: boolean; onClick?: () => void }) {
  const inside = (
    <>
      <span className={`flex min-w-0 flex-1 flex-col ${description ? "gap-[7px]" : ""}`}>
        <strong className="text-sm font-bold text-[#43306d] lg:text-[17px] lg:font-semibold">{label}</strong>
        {description && (
          <span className="text-xs font-medium leading-normal text-[#584e4d] lg:text-sm">
            {description}
          </span>
        )}
      </span>
      {value && (
        <span className="mr-2.5 text-xs font-medium text-[#838383] lg:text-sm">
          {value}
        </span>
      )}
      <ForwardCaret className="lg:size-5" />
    </>
  );
  const cls = "flex min-h-[62px] w-full items-center justify-between rounded-[14px] bg-white px-5 py-[22px] text-left lg:min-h-[65px] lg:py-6";
  return href ? (
    <Link className={cls} href={href}>
      {inside}
    </Link>
  ) : (
    <button className={`${cls} border-0 disabled:opacity-60`} disabled={disabled} onClick={onClick} type="button">
      {inside}
    </button>
  );
}
function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`flex w-full flex-col gap-3.5 lg:gap-[22px] ${className}`}>
      <h2 className="text-base font-bold text-[#43306d] lg:text-lg">{title}</h2>
      {children}
    </section>
  );
}

type ConfirmAction = "seal" | "plan" | "account" | "logout";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<"seal" | "plan" | "account" | "logout" | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [planDeactivated, setPlanDeactivated] = useState(false);
  const [planSealed, setPlanSealed] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [appealPending, setAppealPending] = useState(false);

  useEffect(() => {
    let active = true;
    getMyPlan()
      .then((plan) => { if (active) setPlanSealed(plan.status === "SEALED"); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const handleSealPlan = async () => {
    if (pendingAction || planSealed) return;
    setConfirmAction(null);
    setPendingAction("seal");
    setActionMessage("");
    try {
      const plan = await getMyPlan();
      if (plan.status !== "SEALED") await sealPackage(plan.planId);
      setPlanSealed(true);
      setActionMessage("계획이 봉인되었습니다.");
      showSnackbar("계획이 봉인되었습니다.");
      router.refresh();
    } catch (error) {
      setActionMessage(getApiErrorMessage(error, "계획을 봉인하지 못했습니다."));
    } finally {
      setPendingAction(null);
    }
  };

  const handleAppealNavigation = async () => {
    if (appealPending || pendingAction) return;
    setAppealPending(true);
    setActionMessage("");
    try {
      const plan = await getMyPlan();
      const settings = await getReleaseSettings(plan.planId);
      const allVerified = settings.selfWarningEmailVerified
        && settings.disputeContact?.verified === true;
      router.push(allVerified ? "/appeal/edit" : "/appeal");
    } catch (error) {
      setActionMessage(getApiErrorMessage(error, "대기·이의제기 상태를 확인하지 못했습니다."));
      setAppealPending(false);
    }
  };

  const handleDeactivatePlan = async () => {
    if (pendingAction || planDeactivated) return;

    setConfirmAction(null);
    setPendingAction("plan");
    setActionMessage("");
    try {
      const plan = await getMyPlan();
      await deactivatePlan(plan.planId);
      setPlanDeactivated(true);
      setActionMessage("계획이 비활성화되었습니다.");
      showSnackbar("계획이 비활성화되었습니다.");
      router.refresh();
    } catch (error) {
      setActionMessage(getApiErrorMessage(error, "계획을 비활성화하지 못했습니다."));
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (pendingAction) return;

    setConfirmAction(null);
    setPendingAction("account");
    setActionMessage("");
    try {
      await deleteCurrentUser();
      clearTokens();
      clearAllStoredConversationIds();
      showSnackbarAfterNavigation("계정이 삭제되었습니다.");
      router.replace("/login");
    } catch (error) {
      setActionMessage(getApiErrorMessage(error, "계정을 삭제하지 못했습니다."));
      setPendingAction(null);
    }
  };

  const handleLogout = async () => {
    if (pendingAction) return;
    setConfirmAction(null);
    setPendingAction("logout");
    try {
      await logout();
    } catch {
      // 서버 로그아웃 실패 여부와 관계없이 logout()이 로컬 인증 정보를 제거합니다.
    } finally {
      showSnackbarAfterNavigation("로그아웃되었습니다.");
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <PageContainer
      className="items-center gap-0 pb-[100px] pt-[70px] lg:min-h-[calc(100dvh-125px)] lg:max-w-none lg:px-[120px] lg:pb-20 lg:pt-0"
      data-node-id="439:4905"
    >
      <PageHeader title="설정" />
      <div className="mx-auto flex w-full max-w-[342px] flex-col items-center gap-5 pt-5 lg:max-w-[460px] lg:gap-10 lg:pt-[50px]">
        <UserProfileSummary />
        <div className="flex w-full flex-col gap-7 lg:gap-5">
        <Section
          className="order-1"
          title="계정 관리"
        >
          <div className="flex flex-col gap-3 lg:gap-[22px]">
            <div><Row disabled={Boolean(pendingAction) || planDeactivated} label={planDeactivated ? "계획 비활성화 완료" : "계획 비활성화"} onClick={() => setConfirmAction("plan")} /></div>
            <button className="flex min-h-[62px] w-full items-center justify-between rounded-[14px] bg-white px-5 py-[22px] text-left disabled:cursor-wait disabled:opacity-60 lg:min-h-[65px] lg:py-6" disabled={Boolean(pendingAction)} onClick={() => setConfirmAction("logout")} type="button">
              <strong className="text-sm font-bold text-[#43306d] lg:text-[17px] lg:font-semibold">{pendingAction === "logout" ? "로그아웃 중" : "로그아웃"}</strong>
              <Image alt="" className="size-[18px] lg:size-5" width={20} height={20} src="/icons/settings/sign-out.svg" />
            </button>
          </div>
        </Section>
        <Section
          className="order-3"
          title="계획 관리"
        >
          <div className="flex flex-col gap-3">
            {plans.map((x) => (
              x.label === "계획 봉인하기"
                ? <Row disabled={planSealed || Boolean(pendingAction)} key={x.label} label={planSealed ? "계획 봉인 완료" : x.label} onClick={() => setConfirmAction("seal")} />
                : x.label === "대기 이의제기"
                ? <Row disabled={appealPending || Boolean(pendingAction)} key={x.label} label={x.label} onClick={() => void handleAppealNavigation()} />
                : <Row key={x.label} {...x} />
            ))}
          </div>
        </Section>
        <Section
          className="order-2"
          title="계획･계정 정리"
        >
          <div className="flex flex-col gap-3 lg:gap-[22px]">
            <Row disabled={Boolean(pendingAction) || planDeactivated} label={planDeactivated ? "계획 비활성화 완료" : cleanup[0].label} description={cleanup[0].description} onClick={() => setConfirmAction("plan")} />
            <Row disabled={Boolean(pendingAction)} label={pendingAction === "account" ? "계정 삭제 중" : cleanup[1].label} description={cleanup[1].description} onClick={() => setConfirmAction("account")} />
          </div>
        </Section>
        {actionMessage && <p className="order-4 text-center text-sm text-[#796b6c]" role="status">{actionMessage}</p>}
        </div>
      </div>
      {confirmAction && (
        <ConfirmationDialog
          confirmLabel={confirmAction === "account" ? "삭제하기" : confirmAction === "seal" ? "봉인하기" : confirmAction === "plan" ? "비활성화하기" : "로그아웃하기"}
          description={confirmAction === "account"
            ? <>계정과 모든 계획 데이터가 영구 삭제돼요.<br />삭제한 정보는 다시 복구할 수 없어요.</>
            : confirmAction === "seal"
              ? <>계획을 봉인하면 작성한 내용이 최종 확정돼요.<br />봉인 후에는 계획을 수정할 수 없어요.</>
            : confirmAction === "plan"
              ? <>비활성화하면 계획이 더 이상 실행되지 않아요.<br />필요한 내용을 모두 확인한 뒤 진행해 주세요.</>
              : <>로그아웃하면 로그인 화면으로 이동해요.<br />작성 중인 내용이 있다면 먼저 저장해 주세요.</>}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => void (confirmAction === "seal" ? handleSealPlan() : confirmAction === "plan" ? handleDeactivatePlan() : confirmAction === "account" ? handleDeleteAccount() : handleLogout())}
          title={confirmAction === "account" ? "계정을 삭제할까요?" : confirmAction === "seal" ? "계획을 봉인할까요?" : confirmAction === "plan" ? "계획을 비활성화할까요?" : "로그아웃할까요?"}
        />
      )}
      <BottomTabBar activeTab="settings" />
    </PageContainer>
  );
}

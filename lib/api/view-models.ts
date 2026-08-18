import { getEmailDeliveries, getEvidenceDeletionStatus } from "./admin";
import {
  getConfirmerDetail,
  getHandoffChecks,
  getMyPlan,
  getRecipientDetail,
  getRoleChecks,
} from "./plan";

const roleLabel = {
  FAMILY_MANAGER: "가족 담당자",
  RELATIONSHIP_MANAGER: "관계 정리 담당자",
  WORK_MANAGER: "업무 처리 담당자",
} as const;

const acceptanceLabel = {
  PENDING: "수락 대기",
  ACCEPTED: "수락 완료",
  DECLINED: "거절",
  EXPIRED: "기간 만료",
} as const;

export async function getRoleInspectionPeople() {
  const plan = await getMyPlan();
  const checks = await getRoleChecks(plan.planId);
  return Promise.all(checks.map(async (check) => {
    if (check.type === "CONFIRMER") {
      const detail = await getConfirmerDetail(plan.planId, check.id);
      return {
        id: String(check.id),
        name: detail.name,
        email: detail.email,
        status: acceptanceLabel[detail.acceptanceStatus],
        type: "verifier" as const,
        role: "확인자",
        summary: "사용자의 사망 사실 확인 및 날짜 전달",
        waitingPeriod: "",
        groups: [],
      };
    }
    const detail = await getRecipientDetail(plan.planId, check.id);
    const groups = detail.items.map((item) => ({
      title: item.title,
      tasks: [[item.targetName || item.locationType || item.title, item.content]] as [string, string][],
    }));
    return {
      id: String(check.id),
      name: detail.name,
      email: detail.email,
      status: acceptanceLabel[detail.acceptanceStatus],
      type: "manager" as const,
      role: roleLabel[detail.roleType],
      summary: detail.items.map((item) => item.title).join(" / "),
      waitingPeriod: Math.ceil(detail.maxWaitHours / 24) + "일",
      groups,
    };
  }));
}

export async function getHandoffInspectionPeople() {
  const plan = await getMyPlan();
  const status = await getHandoffChecks(plan.planId);
  console.log("[인계 점검 API 응답]", JSON.stringify(status, null, 2));
  const assignees = status.assignees.map((person) => ({
    name: person.name,
    type: "담당자" as const,
    ready: person.isReady ? "준비 완료" : "준비 대기",
    role: roleLabel[person.roleType],
    complete: person.isReady,
    checks: [
      ["이메일", person.isEmailSent ? "전달 완료" : "확인 필요", person.isEmailSent],
      ["역할", person.isRoleAccepted ? "수락 완료" : "수락 대기", person.isRoleAccepted],
      ["대체 담당자", person.backupName || "없음", Boolean(person.isBackupAccepted || !person.backupName)],
    ] as [string, string, boolean][],
    question: person.checkInquiry || person.inquiry || "없음",
  }));
  const confirmers = status.confirmers.map((person) => ({
    name: person.name,
    type: "확인자" as const,
    ready: person.isReady ? "준비 완료" : "준비 대기",
    role: "확인자",
    complete: person.isReady,
    checks: [
      ["이메일", person.isEmailSent ? "전달 완료" : "확인 필요", person.isEmailSent],
      ["역할", person.isRoleAccepted ? "수락 완료" : "수락 대기", person.isRoleAccepted],
    ] as [string, string, boolean][],
    question: person.inquiry || "없음",
  }));
  return [...assignees, ...confirmers];
}

export async function getEmailAudit(caseId: string) {
  const deliveries = await getEmailDeliveries(caseId);
  const sent = deliveries.filter((item) => item.sentAt).length;
  const bounced = deliveries.filter((item) => item.bouncedAt || item.failureReason).length;
  return {
    totalCount: deliveries.length,
    summary: ["발송 " + sent, "반송 " + bounced],
    recipients: deliveries.map((item) => ({
      id: item.logId,
      role: item.emailType,
      name: "수신자",
      email: item.recipientEmail,
      status: item.status,
      warning: Boolean(item.bouncedAt || item.failureReason),
      events: [
        ["발송", item.sentAt || item.requestedAt],
        ["열람", item.openedAt || "-"],
        ["완료", item.canceledAt || item.bouncedAt || "-"],
      ] as [string, string][],
    })),
  };
}

export async function getEvidenceAuditRecords(evidenceIds: string[]) {
  const records = await Promise.all(evidenceIds.map(getEvidenceDeletionStatus));
  return records.map((record) => ({
    evidenceId: record.evidenceId,
    title: record.fileName,
    status: record.deletedAt ? "삭제 완료" : record.failureReason ? "삭제 실패" : "삭제 예정",
    dates: [record.reviewedAt || "-", record.deleteScheduledAt || "-", record.deletedAt || "-"],
    hash: record.integrityHash,
    fullHash: record.integrityHash,
    failed: Boolean(record.failureReason),
    failureReason: record.failureReason || undefined,
  }));
}

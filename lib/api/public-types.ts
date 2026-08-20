export type AcceptanceStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";

export interface ConfirmerInviteResponse {
  confirmerName: string;
  ownerName: string;
  acceptanceStatus: AcceptanceStatus;
  email: string;
  expiresAt: string;
  contactEmail: string;
}

export interface ConfirmerDecisionResponse {
  confirmId: string;
  acceptanceStatus: "ACCEPTED" | "DECLINED";
  acceptedAt: string | null;
  inquiry: string | null;
  reportDeathToken: string | null;
}

export interface RecipientInviteTask { title: string; content: string }
export interface RecipientInviteResponse {
  assigneeName: string;
  ownerName: string;
  roleType: "FAMILY_MANAGER" | "WORK_MANAGER" | "RELATIONSHIP_MANAGER";
  tasks: RecipientInviteTask[];
  disclosureScope: "FAMILY" | "WORK" | "RELATIONSHIP";
  isBackup: boolean;
  acceptanceStatus: AcceptanceStatus;
  email: string;
  expiresAt: string;
  contactEmail: string;
}

export interface RecipientInviteDecisionResponse {
  assigneeId: string;
  acceptanceStatus: "ACCEPTED" | "DECLINED";
  acceptedAt: string | null;
  inquiry: string | null;
}

export interface DeathReportResponse {
  confirmId: string;
  caseId: string;
  reportStatus: "NOT_REPORTED" | "REPORTED" | "MATCHED" | "MISMATCHED";
  reportedAt: string | null;
  evidenceUploadToken: string;
}

export interface ReleaseStatusResponse {
  hasActiveCase: boolean;
  status: string | null;
  waitingEndsAt: string | null;
  remainingDays: number | null;
  canceledAt: string | null;
}

export interface HandoverStageResponse {
  stageId: string;
  stageOrder: number;
  status: "PENDING" | "READY" | "SENT" | "COMPLETED" | "BOUNCED" | "FALLBACK" | "BLOCKED";
  recipientName: string;
  recipientEmail: string;
  sentAt: string | null;
  confirmedAt: string | null;
  remainingMinutes: number | null;
}

export interface EvidenceSubmitResponse {
  evidenceId: string;
  fileName: string;
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED" | "ADDITIONAL_INFO_REQUESTED";
  submittedAt: string;
}

export type EvidenceType = "DEATH_CERTIFICATE" | "DEATH_REPORT" | "POSTMORTEM_REPORT";

export interface PosthumousAccessResponse {
  recipientName: string;
  authorName: string;
  roleType: string;
  roleLabel: string;
  expiresAt: string;
  otpSent: boolean;
  contactEmail: string;
}

export interface OtpVerifyResponse { accessSessionId: string; sessionExpiresAt: string }
export interface OtpSendResponse { maskedEmail: string; otpExpiresAt: string; resendAvailableAt: string }
export interface ObjectionResponse { objectionId: string; status: string; raisedAt: string }
export interface PackageIssueResponse { issueId: string; actionId: string; status: string }
export interface PackageActionResponse {
  actionId: string;
  action: string;
  title: string;
  content: string;
  targetName: string | null;
  locationType: string | null;
  precondition: string | null;
  preconditionMet: boolean;
  status: "PENDING" | "COMPLETED";
}
export interface PosthumousPackageResponse {
  roleLabel: string;
  authorName: string;
  totalCount: number;
  completedCount: number;
  notice: string;
  actions: PackageActionResponse[];
}

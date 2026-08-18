// 계획 동의, 대화, 담당자, 실행 순서 API에서 사용하는 데이터 타입을 정의합니다.

import type { ApiResponse } from "./auth-types";

export type PlanStatus = "DRAFT" | "SEALED" | "DEACTIVATED";
export type LifeAreaCategory = "FAMILY" | "RELATIONSHIP_CLEANUP" | "WORK_CONTINUITY";
export type ConversationTurnType = "QUESTION" | "RESULT";
export type ApiId = string | number;

export interface ConsentResponse {
  agreed: boolean;
  agreedAt: string | null;
}

export interface ConsentRequest {
  serviceGuideAgreed: boolean;
  handoffGuideAgreed: boolean;
}

export interface PlanResponse {
  planId: ApiId;
  status: PlanStatus;
  createdAt: string;
  orderConfirmedAt: string | null;
}

export interface PlanItem {
  itemId: ApiId;
  targetName: string | null;
  locationType: string | null;
  action: string | null;
  title: string;
  content: string;
  precondition: string | null;
  disclosureScope: string | null;
  sourceExcerpt: string | null;
  status: string;
  sortOrder: number;
  actionType: "DELETE" | "TRANSFER" | "OTHER";
}

// 계획 카드 인라인 수정 API에 전달하는 필드입니다.
export interface PlanItemUpdateRequest {
  targetName: string;
  locationType: string;
  action: string;
  title: string;
  content: string;
  precondition?: string;
  disclosureScope: string;
  actionType?: "DELETE" | "TRANSFER" | "OTHER";
}

export interface LifeAreaResponse {
  category: LifeAreaCategory;
  items: PlanItem[];
}

export interface ConversationResponse {
  conversationId: ApiId;
  createdAt: string;
}

export interface ConversationMessage {
  messageId: ApiId;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export interface MessageHistoryResponse {
  messages: ConversationMessage[];
  hasNext: boolean;
}

export interface ConversationTurnResponse {
  type: ConversationTurnType;
  question: string | null;
  items: PlanItem[] | null;
}

export interface ConfirmerRegisterRequest {
  name: string;
  email: string;
}

export interface RecipientRegisterRequest {
  itemId: ApiId;
  name: string;
  email: string;
  maxWaitHours: number;
  backup?: { name: string; email: string };
}

export interface RoleCheckSummary {
  type: "RECIPIENT" | "CONFIRMER";
  id: ApiId;
  name: string;
  acceptanceStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
}

export interface RecipientDetailResponse {
  assigneeId: ApiId;
  name: string;
  email: string;
  roleType: "FAMILY_MANAGER" | "WORK_MANAGER" | "RELATIONSHIP_MANAGER";
  acceptanceStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  maxWaitHours: number;
  items: PlanItem[];
}

export interface RecipientUpdateRequest {
  name: string;
  email: string;
}

export interface RecipientUpdateResponse extends RecipientUpdateRequest {
  assigneeId: ApiId;
  roleType: "FAMILY_MANAGER" | "WORK_MANAGER" | "RELATIONSHIP_MANAGER";
  acceptanceStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  emailSent: boolean;
  bounceType: "NONE" | "TEMPORARY" | "PERMANENT" | null;
}

export interface HandoffCheckAssignee {
  assigneeId: ApiId;
  name: string;
  roleType: "FAMILY_MANAGER" | "WORK_MANAGER" | "RELATIONSHIP_MANAGER";
  isEmailSent: boolean;
  isRoleAccepted: boolean;
  backupName: string | null;
  isBackupAccepted: boolean;
  inquiry: string | null;
  isReady: boolean;
  lastCheckSentAt?: string | null;
  checkEmailReached?: boolean;
  checkRoleUnderstood?: boolean;
  checkScopeUnderstood?: boolean;
  checkInquiry?: string | null;
  checkRespondedAt?: string | null;
}

export interface HandoffCheckConfirmer {
  confirmId: ApiId;
  name: string;
  isEmailSent: boolean;
  isRoleAccepted: boolean;
  inquiry: string | null;
  isReady: boolean;
}

export interface HandoffCheckStatusResponse {
  assigneeTotalCount: number;
  assigneeReadyCount: number;
  assignees: HandoffCheckAssignee[];
  confirmerTotalCount: number;
  confirmerReadyCount: number;
  confirmers: HandoffCheckConfirmer[];
}

export interface ConfirmerDetailResponse {
  confirmId: ApiId;
  name: string;
  email: string;
  acceptanceStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
}

export interface OrderCheckItem {
  itemId: ApiId;
  sortOrder: number;
  title: string;
  actionType: "DELETE" | "TRANSFER" | "OTHER";
  recipientName: string | null;
  maxWaitHours: number | null;
  acceptanceStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | null;
  conflict: boolean;
  conflictMessage: string | null;
  warning: boolean;
  warningMessage: string | null;
}

export interface OrderCheckResponse {
  items: OrderCheckItem[];
  hasConflict: boolean;
}

// 모든 계획 API가 사용하는 공통 응답 래퍼 타입입니다.
export type PlanApiResponse<T> = ApiResponse<T>;

export interface LifeAreaSummary {
  category: LifeAreaCategory;
  label: string;
  summary: string;
  itemCount: number;
  isWritten: boolean;
}

export interface ReleaseStatus {
  hasActiveCase: boolean;
  status: string | null;
  waitingEndsAt: string | null;
  remainingDays: number | null;
  canceledAt: string | null;
}

export interface PlanSummaryResponse {
  planId: ApiId;
  status: PlanStatus;
  userName: string;
  lifeAreas: LifeAreaSummary[];
  recipientAcceptedCount: number;
  recipientTotalCount: number;
  confirmerAcceptedCount: number;
  confirmerTotalCount: number;
  confirmerNames: string[];
  backupMissingCount: number;
  unresolvedConflictCount: number;
  waitingDays: number;
  releaseCase: ReleaseStatus | null;
}

export interface ReleaseSettingsResponse {
  planId: ApiId;
  waitingDays: number;
  selfWarningEmail: string | null;
  selfWarningEmailVerified: boolean;
  disputeContact: {
    contactId: ApiId;
    name: string;
    email: string;
    verified: boolean;
  } | null;
}

export interface SelfWarningEmailResponse {
  planId: ApiId;
  email: string;
  verified: boolean;
  emailSent: boolean;
}

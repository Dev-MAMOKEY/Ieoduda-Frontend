// 계획 동의, 대화, 담당자, 실행 순서 API에서 사용하는 데이터 타입을 정의합니다.

import type { ApiResponse } from "./auth-types";

export type PlanStatus = "DRAFT" | "SEALED" | "DEACTIVATED";
export type LifeAreaCategory = "FAMILY" | "RELATIONSHIP_CLEANUP" | "WORK_CONTINUITY";
export type ConversationTurnType = "QUESTION" | "RESULT";

export interface ConsentResponse {
  agreed: boolean;
  agreedAt: string | null;
}

export interface PlanResponse {
  planId: number;
  status: PlanStatus;
  createdAt: string;
  orderConfirmedAt: string | null;
}

export interface PlanItem {
  itemId: number;
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
  conversationId: number;
  createdAt: string;
}

export interface ConversationMessage {
  messageId: number;
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
  itemId: number;
  name: string;
  email: string;
  maxWaitHours: number;
  backup?: { name: string; email: string };
}

export interface OrderCheckItem {
  itemId: number;
  sortOrder: number;
  title: string;
  actionType: "DELETE" | "TRANSFER" | "OTHER";
  recipientName: string | null;
  maxWaitHours: number | null;
  acceptanceStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED" | null;
  conflict: boolean;
  conflictMessage: string | null;
}

export interface OrderCheckResponse {
  items: OrderCheckItem[];
  hasConflict: boolean;
}

// 모든 계획 API가 사용하는 공통 응답 래퍼 타입입니다.
export type PlanApiResponse<T> = ApiResponse<T>;

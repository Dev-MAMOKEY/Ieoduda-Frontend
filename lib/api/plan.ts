// Swagger 명세에 정의된 동의 및 계획 관련 HTTP 요청을 한곳에서 제공합니다.

import { apiClient } from "./client";
import type {
  ConfirmerRegisterRequest,
  ConsentResponse,
  ConversationResponse,
  ConversationTurnResponse,
  LifeAreaResponse,
  MessageHistoryResponse,
  OrderCheckResponse,
  PlanApiResponse,
  PlanResponse,
  PlanItem,
  PlanItemUpdateRequest,
  RecipientRegisterRequest,
  RecipientDetailResponse,
  RecipientUpdateRequest,
  RecipientUpdateResponse,
  RoleCheckSummary,
  HandoffCheckStatusResponse,
} from "./plan-types";

// API 공통 응답에서 실제 화면 데이터만 꺼내고 비정상 응답을 차단합니다.
function unwrap<T>(response: PlanApiResponse<T>): T {
  if (!response.success || response.data == null) {
    throw new Error(response.error?.message ?? "요청을 처리하지 못했습니다.");
  }
  return response.data;
}

export async function getConsent() {
  const { data } = await apiClient.get<PlanApiResponse<ConsentResponse>>("/users/me/consent");
  return unwrap(data);
}

export async function agreeToHandoff() {
  const { data } = await apiClient.post<PlanApiResponse<ConsentResponse>>("/users/me/consent");
  return unwrap(data);
}

export async function getMyPlan() {
  const { data } = await apiClient.get<PlanApiResponse<PlanResponse>>("/api/plans/me");
  return unwrap(data);
}

export async function getLifeAreas(planId: number) {
  const { data } = await apiClient.get<PlanApiResponse<LifeAreaResponse[]>>(`/api/plans/${planId}/life-areas`);
  return unwrap(data);
}

export async function registerConfirmers(planId: number, confirmers: ConfirmerRegisterRequest[]) {
  const { data } = await apiClient.post(`/api/plans/${planId}/confirmers`, { confirmers });
  return data.data;
}

export async function startConversation(planId: number) {
  const { data } = await apiClient.post<PlanApiResponse<ConversationResponse>>(`/api/plans/${planId}/conversations`);
  return unwrap(data);
}

export async function getConversationMessages(planId: number, conversationId: number) {
  const { data } = await apiClient.get<PlanApiResponse<MessageHistoryResponse>>(
    `/api/plans/${planId}/conversations/${conversationId}/messages`,
    { params: { page: 0, size: 50 } },
  );
  return unwrap(data);
}

export async function sendConversationMessage(planId: number, conversationId: number, content: string) {
  const { data } = await apiClient.post<PlanApiResponse<ConversationTurnResponse>>(
    `/api/plans/${planId}/conversations/${conversationId}/messages`,
    { content },
  );
  return unwrap(data);
}

export async function approvePlanItem(planId: number, itemId: number) {
  // AI가 만든 제안 항목의 원문 근거를 서버에서 검증한 뒤 승인 상태로 변경합니다.
  const { data } = await apiClient.post<PlanApiResponse<PlanItem>>(
    `/api/plans/${planId}/items/review`,
    { itemId },
  );
  return unwrap(data);
}

export async function updatePlanItem(planId: number, itemId: number, request: PlanItemUpdateRequest) {
  // 카드에서 수정한 전체 필드를 인라인 수정 API에 전달합니다.
  const { data } = await apiClient.put<PlanApiResponse<PlanItem>>(
    `/api/plans/${planId}/items/${itemId}`,
    request,
  );
  return unwrap(data);
}

export async function deletePlanItem(planId: number, itemId: number) {
  // 서버에서 항목을 완전히 삭제하므로 화면 확인 절차를 거친 뒤 호출해야 합니다.
  await apiClient.delete(`/api/plans/${planId}/items/${itemId}`);
}

export async function registerRecipients(planId: number, recipients: RecipientRegisterRequest[]) {
  const { data } = await apiClient.post(`/api/plans/${planId}/recipients`, { recipients });
  return data.data;
}

export async function getRoleChecks(planId: number) {
  // 역할 점검 목록에서 계획에 등록된 담당자 ID를 조회합니다.
  const { data } = await apiClient.get<PlanApiResponse<RoleCheckSummary[]>>(`/api/plans/${planId}/role-checks`);
  return unwrap(data);
}

export async function getRecipientDetail(planId: number, assigneeId: number) {
  // 담당자 이름·이메일과 배정된 계획 항목 전체를 상세 조회합니다.
  const { data } = await apiClient.get<PlanApiResponse<RecipientDetailResponse>>(`/api/plans/${planId}/recipients/${assigneeId}`);
  return unwrap(data);
}

export async function updateRecipient(planId: number, assigneeId: number, request: RecipientUpdateRequest) {
  // 이름과 이메일만 수정하며 이메일 변경 시 서버가 수락 상태와 재발송을 처리합니다.
  const { data } = await apiClient.put<PlanApiResponse<RecipientUpdateResponse>>(
    `/api/plans/${planId}/recipients/${assigneeId}`,
    request,
  );
  return unwrap(data);
}

export async function getHandoffChecks(planId: number) {
  // 기존 대체 담당자 등록 여부와 이름을 인계 점검 데이터에서 조회합니다.
  const { data } = await apiClient.get<PlanApiResponse<HandoffCheckStatusResponse>>(`/api/plans/${planId}/handoff-checks`);
  return unwrap(data);
}

export async function getOrderCheck(planId: number) {
  const { data } = await apiClient.get<PlanApiResponse<OrderCheckResponse>>(`/api/plans/${planId}/items/order`);
  return unwrap(data);
}

export async function reorderPlanItems(planId: number, itemIds: number[]) {
  const { data } = await apiClient.put<PlanApiResponse<OrderCheckResponse>>(`/api/plans/${planId}/items/order`, { itemIds });
  return unwrap(data);
}

export async function confirmPlanOrder(planId: number) {
  const { data } = await apiClient.post(`/api/plans/${planId}/items/order/confirm`);
  return data.data;
}

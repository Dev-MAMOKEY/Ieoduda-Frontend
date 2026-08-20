// Swagger 명세에 정의된 동의 및 계획 관련 HTTP 요청을 한곳에서 제공합니다.

import { apiClient } from "./client";
import type {
  ConfirmerRegisterRequest,
  ConfirmerDetailResponse,
  ConsentRequest,
  ConsentResponse,
  ConversationResponse,
  ConversationTurnResponse,
  LifeAreaResponse,
  MessageHistoryResponse,
  OrderCheckResponse,
  PlanApiResponse,
  PlanSummaryResponse,
  ReleaseSettingsResponse,
  SelfWarningEmailResponse,
  ApiId,
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
import { unwrap } from "./response";

export async function getConsent() {
  const { data } = await apiClient.get<PlanApiResponse<ConsentResponse>>("/users/me/consent");
  return unwrap(data);
}

export async function agreeToHandoff(request: ConsentRequest) {
  const { data } = await apiClient.post<PlanApiResponse<ConsentResponse>>("/api/consents", request);
  return unwrap(data);
}

export async function getMyPlan() {
  const { data } = await apiClient.get<PlanApiResponse<PlanSummaryResponse>>("/api/plans/current/summary");
  return unwrap(data);
}

export async function getLifeAreas(planId: ApiId) {
  const { data } = await apiClient.get<PlanApiResponse<LifeAreaResponse[]>>(`/api/plans/${planId}/life-areas`);
  return unwrap(data);
}

export async function registerConfirmers(planId: ApiId, confirmers: ConfirmerRegisterRequest[]) {
  const { data } = await apiClient.post(`/api/plans/${planId}/confirmers`, { confirmers });
  return data.data;
}

export async function startConversation(planId: ApiId) {
  const { data } = await apiClient.post<PlanApiResponse<ConversationResponse>>(`/api/plans/${planId}/conversations`);
  return unwrap(data);
}

export async function getConversationMessages(planId: ApiId, conversationId: ApiId) {
  const { data } = await apiClient.get<PlanApiResponse<MessageHistoryResponse>>(
    `/api/plans/${planId}/conversations/${conversationId}/messages`,
    { params: { page: 0, size: 50 } },
  );
  return unwrap(data);
}

export async function sendConversationMessage(planId: ApiId, conversationId: ApiId, content: string) {
  const { data } = await apiClient.post<PlanApiResponse<ConversationTurnResponse>>(
    `/api/plans/${planId}/conversations/${conversationId}/messages`,
    { content },
  );
  return unwrap(data);
}

export async function approvePlanItem(planId: ApiId, itemId: ApiId) {
  // AI가 만든 제안 항목의 원문 근거를 서버에서 검증한 뒤 승인 상태로 변경합니다.
  const { data } = await apiClient.post<PlanApiResponse<PlanItem>>(
    `/api/plans/${planId}/items/review`,
    { itemId },
  );
  return unwrap(data);
}

export async function updatePlanItem(planId: ApiId, itemId: ApiId, request: PlanItemUpdateRequest) {
  // 카드에서 수정한 전체 필드를 인라인 수정 API에 전달합니다.
  const { data } = await apiClient.put<PlanApiResponse<PlanItem>>(
    `/api/plans/${planId}/items/${itemId}`,
    request,
  );
  return unwrap(data);
}

export async function deletePlanItem(planId: ApiId, itemId: ApiId) {
  // 서버에서 항목을 완전히 삭제하므로 화면 확인 절차를 거친 뒤 호출해야 합니다.
  await apiClient.delete(`/api/plans/${planId}/items/${itemId}`);
}

export async function registerRecipients(planId: ApiId, recipients: RecipientRegisterRequest[]) {
  const { data } = await apiClient.post(`/api/plans/${planId}/recipients`, { recipients });
  return data.data;
}

export async function getRoleChecks(planId: ApiId) {
  // 역할 점검 목록에서 계획에 등록된 담당자 ID를 조회합니다.
  const { data } = await apiClient.get<PlanApiResponse<RoleCheckSummary[]>>(`/api/plans/${planId}/role-checks`);
  return unwrap(data);
}

export async function getRecipientDetail(planId: ApiId, assigneeId: ApiId) {
  // 담당자 이름·이메일과 배정된 계획 항목 전체를 상세 조회합니다.
  const { data } = await apiClient.get<PlanApiResponse<RecipientDetailResponse>>(`/api/plans/${planId}/recipients/${assigneeId}`);
  return unwrap(data);
}

export async function updateRecipient(planId: ApiId, assigneeId: ApiId, request: RecipientUpdateRequest) {
  // 이름과 이메일만 수정하며 이메일 변경 시 서버가 수락 상태와 재발송을 처리합니다.
  const { data } = await apiClient.put<PlanApiResponse<RecipientUpdateResponse>>(
    `/api/plans/${planId}/recipients/${assigneeId}`,
    request,
  );
  return unwrap(data);
}

export async function getHandoffChecks(planId: ApiId) {
  // 기존 대체 담당자 등록 여부와 이름을 인계 점검 데이터에서 조회합니다.
  const { data } = await apiClient.get<PlanApiResponse<HandoffCheckStatusResponse>>(`/api/plans/${planId}/handoff-checks`);
  return unwrap(data);
}

export async function getOrderCheck(planId: ApiId) {
  const { data } = await apiClient.get<PlanApiResponse<OrderCheckResponse>>(`/api/plans/${planId}/items/order`);
  return unwrap(data);
}

export async function reorderPlanItems(planId: ApiId, itemIds: ApiId[]) {
  const { data } = await apiClient.put<PlanApiResponse<OrderCheckResponse>>(`/api/plans/${planId}/items/order`, { itemIds });
  return unwrap(data);
}

export async function confirmPlanOrder(planId: ApiId) {
  const { data } = await apiClient.post(`/api/plans/${planId}/items/order/confirm`);
  return data.data;
}

export async function getConfirmerDetail(planId: ApiId, confirmId: ApiId) {
  const { data } = await apiClient.get<PlanApiResponse<ConfirmerDetailResponse>>("/api/plans/" + planId + "/confirmers/" + confirmId);
  return unwrap(data);
}

export async function updateConfirmer(planId: ApiId, confirmId: ApiId, name: string, email: string) {
  const { data } = await apiClient.put("/api/plans/" + planId + "/confirmers/" + confirmId, { name, email });
  return data.data;
}

export async function resendRecipientAcceptanceEmail(recipientId: ApiId) {
  const { data } = await apiClient.post<PlanApiResponse<unknown>>(`/api/recipients/${recipientId}/acceptance-email`);
  return unwrap(data);
}

export async function resendConfirmerAcceptanceEmail(confirmId: ApiId) {
  const { data } = await apiClient.post<PlanApiResponse<unknown>>(`/api/confirmers/${confirmId}/acceptance-email`);
  return unwrap(data);
}

export async function getReleaseSettings(planId: ApiId) {
  const { data } = await apiClient.get<PlanApiResponse<ReleaseSettingsResponse>>("/api/plans/" + planId + "/release-policy");
  return unwrap(data);
}

export async function updateReleasePolicy(planId: ApiId, waitingDays: number) {
  const { data } = await apiClient.put("/api/plans/" + planId + "/release-policy", { waitingDays });
  return data.data;
}

export async function registerSelfWarningEmail(planId: ApiId, email: string) {
  const { data } = await apiClient.post<PlanApiResponse<SelfWarningEmailResponse>>("/api/plans/" + planId + "/self-warning-email", { email });
  return unwrap(data);
}

export async function registerDisputeContact(planId: ApiId, name: string, email: string) {
  const { data } = await apiClient.post("/api/plans/" + planId + "/dispute-contacts", { name, email });
  return data.data;
}

export async function updateDisputeContact(planId: ApiId, contactId: ApiId, name: string, email: string) {
  const { data } = await apiClient.put("/api/plans/" + planId + "/dispute-contacts/" + contactId, { name, email });
  return data.data;
}

export async function resendDisputeContactVerificationEmail(contactId: ApiId) {
  const { data } = await apiClient.post<PlanApiResponse<unknown>>(
    "/api/dispute-contacts/" + contactId + "/verification-email",
  );
  return unwrap(data);
}

export async function deactivatePlan(planId: ApiId) {
  const { data } = await apiClient.post("/api/plans/" + planId + "/deactivate");
  return data.data;
}

export async function getPackagePreview(planId: ApiId) {
  const { data } = await apiClient.get("/api/plans/" + planId + "/packages/preview");
  return data.data;
}

export async function sealPackage(planId: ApiId) {
  const { data } = await apiClient.post("/api/plans/" + planId + "/packages/seal");
  return data.data;
}

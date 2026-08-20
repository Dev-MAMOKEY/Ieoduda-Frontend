import { apiClient, publicApiClient } from "./client";
import type { ApiResponse } from "./auth-types";
import { unwrap } from "./response";
import type {
  ConfirmerDecisionResponse,
  ConfirmerInviteResponse,
  DeathReportResponse,
  EvidenceSubmitResponse,
  EvidenceType,
  HandoverStageResponse,
  ObjectionResponse,
  OtpSendResponse,
  OtpVerifyResponse,
  PackageActionResponse,
  PackageIssueResponse,
  PosthumousAccessResponse,
  PosthumousPackageResponse,
  RecipientInviteDecisionResponse,
  RecipientInviteResponse,
  ReleaseStatusResponse,
} from "./public-types";

export async function getConfirmerInvitation(token: string) {
  const { data } = await publicApiClient.get<ApiResponse<ConfirmerInviteResponse>>("/api/confirmer-acceptances/" + token);
  return unwrap(data);
}
export async function decideConfirmerInvitation(token: string, decision: "accept" | "decline", inquiry = "") {
  const { data } = await publicApiClient.post<ApiResponse<ConfirmerDecisionResponse>>("/api/confirmer-acceptances/" + token + "/" + decision, { inquiry });
  return unwrap(data);
}
export async function reportDeath(token: string, deathDate?: string) {
  const request = deathDate ? { deathDate } : {};
  const { data } = await publicApiClient.post<ApiResponse<DeathReportResponse>>("/api/confirmer-acceptances/" + token + "/death-report", request);
  return unwrap(data);
}
export async function getRecipientInvitation(token: string) {
  const { data } = await publicApiClient.get<ApiResponse<RecipientInviteResponse>>("/api/recipient-acceptances/" + token);
  return unwrap(data);
}
export async function decideRecipientInvitation(token: string, decision: "accept" | "decline", inquiry = "") {
  const { data } = await publicApiClient.post<ApiResponse<RecipientInviteDecisionResponse>>("/api/recipient-acceptances/" + token + "/" + decision, { inquiry });
  return unwrap(data);
}
export async function getWaitingStatus(caseId: string) {
  const { data } = await publicApiClient.get<ApiResponse<ReleaseStatusResponse>>("/api/release-cases/" + caseId + "/waiting");
  return unwrap(data);
}
export async function cancelReleaseCase(caseId: string, token?: string) {
  const path = token
    ? "/api/release-cases/" + caseId + "/cancellations"
    : "/api/release-cases/" + caseId + "/cancel";
  const client = token ? publicApiClient : apiClient;
  const { data } = await client.post<ApiResponse<ReleaseStatusResponse>>(path, token ? { token } : undefined);
  return unwrap(data);
}
export async function createObjection(caseId: string, token: string, reason: string) {
  const { data } = await publicApiClient.post<ApiResponse<ObjectionResponse>>("/api/release-cases/" + caseId + "/disputes", { token, reason });
  return unwrap(data);
}
export async function submitEvidence(caseId: string, token: string, evidenceType: EvidenceType, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await publicApiClient.post<ApiResponse<EvidenceSubmitResponse>>("/api/release-cases/" + caseId + "/evidence/submit", formData, {
    headers: { "Content-Type": "multipart/form-data", "Idempotency-Key": crypto.randomUUID() },
    params: { token, evidenceType },
  });
  return unwrap(data);
}
export async function getHandoverStage(caseId: string, stageId: string) {
  const { data } = await publicApiClient.get<ApiResponse<HandoverStageResponse>>("/api/release-cases/" + caseId + "/stages/" + stageId);
  return unwrap(data);
}
export async function fallbackHandoverStage(caseId: string, stageId: string) {
  const { data } = await publicApiClient.post<ApiResponse<HandoverStageResponse>>("/api/release-cases/" + caseId + "/stages/" + stageId + "/fallback");
  return unwrap(data);
}
export async function getPosthumousAccess(token: string) {
  const { data } = await publicApiClient.get<ApiResponse<PosthumousAccessResponse>>("/api/posthumous-access/" + token);
  return unwrap(data);
}
export async function sendPosthumousOtp(token: string) {
  const { data } = await publicApiClient.post<ApiResponse<OtpSendResponse>>("/api/posthumous-access/" + token + "/otp");
  return unwrap(data);
}
export async function verifyPosthumousOtp(token: string, otpCode: string) {
  const { data } = await publicApiClient.post<ApiResponse<OtpVerifyResponse>>("/api/posthumous-access/" + token + "/verify", { otpCode });
  return unwrap(data);
}
export async function verifySelfWarningEmail(token: string) {
  const { data } = await publicApiClient.post<ApiResponse<null>>(
    "/api/self-warning-email/" + encodeURIComponent(token) + "/verify",
  );
  if (!data.success) throw new Error(data.error?.message ?? "본인 경고 이메일을 확인하지 못했습니다.");
}
export async function verifyDisputeContactEmail(token: string) {
  const { data } = await publicApiClient.post<ApiResponse<null>>(
    "/api/dispute-contacts/" + encodeURIComponent(token) + "/verify",
  );
  if (!data.success) throw new Error(data.error?.message ?? "이의 제기 연락처를 확인하지 못했습니다.");
}
export async function getPosthumousPackage(accessSessionId: string) {
  const { data } = await publicApiClient.get<ApiResponse<PosthumousPackageResponse>>("/api/posthumous-packages/" + accessSessionId);
  return unwrap(data);
}
export async function completePackageAction(accessSessionId: string, actionId: string) {
  const { data } = await publicApiClient.post<ApiResponse<PackageActionResponse>>("/api/posthumous-packages/" + accessSessionId + "/actions/" + actionId + "/complete");
  return unwrap(data);
}
export async function reportPackageIssue(accessSessionId: string, actionId: string, reason: string) {
  const { data } = await publicApiClient.post<ApiResponse<PackageIssueResponse>>("/api/posthumous-packages/" + accessSessionId + "/issues", { actionId, reason });
  return unwrap(data);
}

import { apiClient } from "./client";
import type { ApiResponse } from "./auth-types";
import type { EmailDelivery, EvidenceDeletionStatus, PageResponse } from "./admin-types";
import { unwrap } from "./response";

export async function getEmailDeliveries(caseId: string) {
  const { data } = await apiClient.get<ApiResponse<EmailDelivery[]>>("/api/admin/release-cases/" + caseId + "/email-deliveries");
  return unwrap(data);
}
export async function retryEmailDelivery(caseId: string, logId: string) {
  const { data } = await apiClient.post<ApiResponse<EmailDelivery>>("/api/admin/release-cases/" + caseId + "/email-deliveries/" + logId + "/retry");
  return unwrap(data);
}
export async function getEvidenceDeletionStatus(evidenceId: string) {
  const { data } = await apiClient.get<ApiResponse<EvidenceDeletionStatus>>("/api/evidence/" + evidenceId + "/deletion-status");
  return unwrap(data);
}
export async function retryEvidenceDeletion(evidenceId: string) {
  const { data } = await apiClient.post<ApiResponse<EvidenceDeletionStatus>>("/api/evidence/" + evidenceId + "/deletion-retry");
  return unwrap(data);
}
export async function getAuthAuditLogs(page = 0, size = 20) {
  const { data } = await apiClient.get<ApiResponse<PageResponse<Record<string, unknown>>>>("/api/admin/auth-audit-logs", { params: { page, size } });
  return unwrap(data);
}
export async function getActionAuditLogs(page = 0, size = 20) {
  const { data } = await apiClient.get<ApiResponse<PageResponse<Record<string, unknown>>>>("/api/admin/action-audit-logs", { params: { page, size } });
  return unwrap(data);
}

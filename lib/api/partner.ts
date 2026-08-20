import { apiClient } from "./client";
import type { ApiResponse } from "./auth-types";
import type { PartnerReview, PartnerReviewListItem } from "./partner-types";
import { unwrap } from "./response";

export async function getPartnerReviews() {
  const { data } = await apiClient.get<ApiResponse<{ reviews: PartnerReviewListItem[] }>>("/api/partner/reviews");
  return unwrap(data).reviews;
}
export async function getPartnerReview(reviewId: string) {
  const { data } = await apiClient.get<ApiResponse<PartnerReview>>("/api/partner/reviews/" + reviewId);
  return unwrap(data);
}
export async function getPartnerReviewFileUrl(reviewId: string) {
  const { data } = await apiClient.post<ApiResponse<{ downloadToken: string; expiresAt: string }>>("/api/partner/reviews/" + reviewId + "/file");
  return unwrap(data);
}
export async function downloadPartnerReviewFile(reviewId: string) {
  const { downloadToken } = await getPartnerReviewFileUrl(reviewId);
  const response = await apiClient.get<Blob>("/api/partner/reviews/" + reviewId + "/file", {
    params: { token: downloadToken },
    responseType: "blob",
  });
  return response.data;
}
export async function decidePartnerReview(reviewId: string, decision: "APPROVE" | "REJECT" | "ADDITIONAL_INFO_REQUESTED", password: string, failureReason?: string) {
  const { data } = await apiClient.post<ApiResponse<PartnerReview>>("/api/partner/reviews/" + reviewId + "/decision", { decision, password, failureReason });
  return unwrap(data);
}

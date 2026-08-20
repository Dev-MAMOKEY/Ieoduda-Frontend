export interface PartnerReviewListItem {
  reviewId: string;
  targetName: string;
  confirmerName: string;
  fileName: string;
  evidenceType: "DEATH_CERTIFICATE" | "DEATH_REPORT" | "POSTMORTEM_REPORT";
  submittedAt: string;
  reviewStatus: "PENDING" | "APPROVED" | "REJECTED" | "ADDITIONAL_INFO_REQUESTED";
}
export interface PartnerReview extends PartnerReviewListItem {
  mimeType: string;
  integrityHash: string;
  reviewedAt: string | null;
  failureReason: string | null;
}

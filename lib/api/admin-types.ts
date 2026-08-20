export interface EmailDelivery {
  logId: string;
  recipientEmail: string;
  emailType: string;
  status: string;
  retryCount: number;
  messageId: string | null;
  requestedAt: string;
  sentAt: string | null;
  openedAt: string | null;
  bouncedAt: string | null;
  canceledAt: string | null;
  failureReason: string | null;
}

export interface EvidenceDeletionStatus {
  evidenceId: string;
  fileName: string;
  evidenceType: "DEATH_CERTIFICATE" | "DEATH_REPORT" | "POSTMORTEM_REPORT";
  reviewedAt: string | null;
  deleteScheduledAt: string | null;
  deletedAt: string | null;
  integrityHash: string;
  failureReason: string | null;
  overdue: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

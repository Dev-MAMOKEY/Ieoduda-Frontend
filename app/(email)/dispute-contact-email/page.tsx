"use client";

import { EmailVerificationPage } from "@/components/EmailVerificationPage";
import { verifyDisputeContactEmail } from "@/lib/api/public";

export default function DisputeContactEmailPage() {
  return (
    <EmailVerificationPage
      description={"이의 제기 연락처로 등록된 이메일이 맞는지 확인해 주세요.\n확인이 완료되면 대기 기간 동안 이의를 제기할 수 있어요."}
      heading="이의 제기 연락처를 확인해 주세요"
      successMessage="이의 제기 연락처 이메일 확인이 완료되었습니다."
      title="이의 제기 연락처 확인"
      verify={verifyDisputeContactEmail}
    />
  );
}

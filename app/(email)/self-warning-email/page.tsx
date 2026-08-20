"use client";

import { EmailVerificationPage } from "@/components/EmailVerificationPage";
import { verifySelfWarningEmail } from "@/lib/api/public";

export default function SelfWarningEmailPage() {
  return (
    <EmailVerificationPage
      description={"이 주소가 본인의 이메일이 맞는지 확인해 주세요.\n확인이 완료되면 실행 전에 경고 메일을 받을 수 있어요."}
      heading="본인 경고 이메일을 확인해 주세요"
      successMessage="본인 경고 이메일 확인이 완료되었습니다."
      title="본인 경고 이메일 확인"
      verify={verifySelfWarningEmail}
    />
  );
}

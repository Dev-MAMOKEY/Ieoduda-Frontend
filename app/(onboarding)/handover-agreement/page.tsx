// 사후 인계 필수 동의 컴포넌트를 공통 온보딩 레이아웃에 배치합니다.
import { HandoverAgreement } from "@/components/features/onboarding/HandoverAgreement";
import { OnboardingShell } from "@/components/features/onboarding/OnboardingShell";

// 서비스 이용 동의를 받는 마지막 온보딩 단계를 렌더링합니다.
export default function HandoverAgreementPage() {
  return (
    <OnboardingShell>
      <HandoverAgreement />
    </OnboardingShell>
  );
}

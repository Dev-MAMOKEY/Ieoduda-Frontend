// 사후 인계 필수 동의 컴포넌트를 공통 온보딩 레이아웃에 배치합니다.
import { HandoverAgreement } from "@/components/features/onboarding/HandoverAgreement";
import { OnboardingShell } from "@/components/features/onboarding/OnboardingShell";

export default function HandoverAgreementPage() {
  return (
    <OnboardingShell>
      <HandoverAgreement />
    </OnboardingShell>
  );
}

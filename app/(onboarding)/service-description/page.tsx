// 첫 번째 온보딩 단계인 서비스 설명과 다음 단계 경로를 정의합니다.
import { OnboardingInfoPage } from "@/components/features/onboarding/OnboardingInfoPage";

// 서비스 소개 카드에 문단별로 표시할 안내 문구입니다.
const serviceDescriptionLines = [
  "사망이 안전하게 확인되면,",
  "가족과 동료에게 필요한 일을",
  "올바른 순서로 이메일로 전달합니다.",
] as const;

// 서비스의 목적을 설명하는 온보딩 단계를 렌더링합니다.
export default function ServiceDescriptionPage() {
  return (
    <OnboardingInfoPage
      title="서비스 안내"
      lines={serviceDescriptionLines}
      href="/restricted-information"
    />
  );
}

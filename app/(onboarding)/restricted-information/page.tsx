// 두 번째 온보딩 단계인 금지 정보 안내와 다음 단계 경로를 정의합니다.
import { OnboardingInfoPage } from "@/components/features/onboarding/OnboardingInfoPage";

const restrictedInformationLines = [
  "비밀번호를 적지 마세요.",
  "계정 이름, 자료위치의 유형과",
  "원하는 처리 결과만 작성합니다.",
] as const;

export default function RestrictedInformationPage() {
  return (
    <OnboardingInfoPage
      title="금지정보 안내"
      lines={restrictedInformationLines}
      href="/handover-agreement"
    />
  );
}

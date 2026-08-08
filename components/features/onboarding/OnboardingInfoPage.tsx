// 공통 온보딩 레이아웃과 안내 카드를 결합해 정보 안내 페이지를 구성합니다.
import { InfoCard } from "./InfoCard";
import { OnboardingShell } from "./OnboardingShell";

// 공통 정보 페이지에 표시할 문구와 다음 경로를 정의합니다.
type OnboardingInfoPageProps = {
  title: string;
  lines: readonly string[];
  href: string;
};

// 공통 셸과 안내 카드를 조합해 설명형 온보딩 화면을 만듭니다.
export function OnboardingInfoPage({
  title,
  lines,
  href,
}: OnboardingInfoPageProps) {
  return (
    <OnboardingShell>
      <InfoCard title={title} lines={lines} href={href} />
    </OnboardingShell>
  );
}

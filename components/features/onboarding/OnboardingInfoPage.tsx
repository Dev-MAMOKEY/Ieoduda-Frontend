// 공통 온보딩 레이아웃과 안내 카드를 결합해 정보 안내 페이지를 구성합니다.
import { InfoCard } from "./InfoCard";
import { OnboardingShell } from "./OnboardingShell";

type OnboardingInfoPageProps = {
  title: string;
  lines: readonly string[];
  href: string;
};

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

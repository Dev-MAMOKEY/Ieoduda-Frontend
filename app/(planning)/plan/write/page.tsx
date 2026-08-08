// 신규 작성과 기존 계획 수정 모드에 따라 초기값을 결정하는 계획작성 라우트입니다.
import { PlanForm } from "@/components/features/planning/PlanForm";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";

// URL 쿼리로 계획 작성 모드를 판별하기 위한 페이지 입력값입니다.
type PlanWritePageProps = {
  searchParams: Promise<{ mode?: string }>;
};

// mode 쿼리에 따라 신규 작성 또는 수정 상태의 계획 폼을 렌더링합니다.
export default async function PlanWritePage({ searchParams }: PlanWritePageProps) {
  const { mode } = await searchParams;
  const editMode = mode === "edit";

  return (
    <main className="min-h-dvh bg-[#f0f0f2]">
      <DesktopHeader authenticated />
      <PlanForm editMode={editMode} />
    </main>
  );
}

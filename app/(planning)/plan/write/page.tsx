// 신규 작성과 기존 계획 수정 모드에 따라 초기값을 결정하는 계획작성 라우트입니다.
import { PlanForm } from "@/components/features/planning/PlanForm";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";

type PlanWritePageProps = {
  searchParams: Promise<{ mode?: string }>;
};

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

// planning 라우트 그룹에서 계획의 세부 내용을 대화로 작성하는 화면입니다.
import { LifeAreaConversation } from "@/components/features/planning/LifeAreaConversation";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";

// AI 대화 방식으로 계획을 구체화하는 화면을 렌더링합니다.
export default function LifeAreaPage() {
  return (
    <main className="min-h-dvh bg-[#f0f0f2]">
      <DesktopHeader authenticated />
      <LifeAreaConversation />
    </main>
  );
}

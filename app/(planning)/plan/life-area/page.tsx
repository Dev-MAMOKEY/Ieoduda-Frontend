// planning 라우트 그룹에서 계획의 세부 내용을 대화로 작성하는 화면입니다.
import { LifeAreaConversation } from "@/components/features/planning/LifeAreaConversation";
import { DesktopHeader } from "@/components/shared/layout/DesktopHeader";

export default function LifeAreaPage() {
  return (
    <main className="min-h-dvh bg-[#f0f0f2]">
      <DesktopHeader authenticated />
      <LifeAreaConversation />
    </main>
  );
}

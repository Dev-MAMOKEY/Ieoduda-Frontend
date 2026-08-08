import type { ReactNode } from "react";

// 계획 폼의 주요 영역 제목에 일관된 스타일을 적용합니다.
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="px-2.5 text-base font-bold text-[#28292e]">{children}</h2>;
}

// 세부 항목의 라벨과 선택 UI를 하나의 폼 영역으로 묶습니다.
export function Subsection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="px-2.5 text-sm font-medium text-[#28292e]">{label}</h3>
      {children}
    </div>
  );
}

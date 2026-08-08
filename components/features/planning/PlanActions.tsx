// 계획 수정 및 신규 작성 버튼을 화면 크기에 맞는 배치와 크기로 제공합니다.
import Link from "next/link";

// 화면 크기에 맞는 버튼 배치를 선택하기 위한 속성입니다.
type PlanActionsProps = {
  desktop?: boolean;
};

// 기존 계획 수정과 새 계획 작성 화면으로 이동하는 동작을 제공합니다.
export function PlanActions({ desktop = false }: PlanActionsProps) {
  const buttonClassName = desktop
    ? "h-[52px] w-full rounded-[30px] bg-[#a8a8a8] px-5 text-base text-white transition-colors hover:bg-[#929292]"
    : "h-[45px] flex-1 rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors hover:bg-[#929292]";

  return (
    <div
      className={
        desktop
          ? "hidden w-full flex-col gap-5 py-1.5 lg:flex"
          : "flex w-full gap-5 py-1.5 lg:hidden"
      }
    >
      <Link className={`flex items-center justify-center ${buttonClassName}`} href="/plan/write?mode=edit">
        계획 수정하기
      </Link>
      <Link className={`flex items-center justify-center ${buttonClassName}`} href="/plan/write">
        새 계획 작성하기
      </Link>
    </div>
  );
}

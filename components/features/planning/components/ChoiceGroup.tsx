import type { PlanSelectionKey } from "../model/planTypes";

// 선택 버튼 목록의 값, 변경 처리, 배치와 오류 상태를 정의합니다.
type ChoiceGroupProps = {
  selectionKey: PlanSelectionKey;
  options: readonly string[];
  value: string;
  onSelect: (key: PlanSelectionKey, value: string) => void;
  equalWidth?: boolean;
  desktopColumns?: 4;
  invalid?: boolean;
};

// 계획 폼의 선택지들을 단일 선택 가능한 버튼 그룹으로 렌더링합니다.
export function ChoiceGroup({
  selectionKey,
  options,
  value,
  onSelect,
  equalWidth = false,
  desktopColumns,
  invalid = false,
}: ChoiceGroupProps) {
  return (
    <div className="flex flex-wrap gap-2 lg:gap-4">
      {options.map((option) => {
        const selected = value === option;

        return (
          <button
            aria-pressed={selected}
            className={`${equalWidth ? "min-w-0 flex-1" : ""} ${desktopColumns === 4 ? "lg:basis-[calc((100%_-_48px)/4)] lg:flex-none" : "lg:flex-1"} whitespace-nowrap rounded-[30px] border px-5 py-3 text-sm transition-colors lg:text-base ${
              selected
                ? "border-[#6e6e6e] bg-[#6e6e6e] text-white"
                : invalid
                  ? "border-[#efb1b1] bg-white text-[#a8a8a8] hover:bg-[#e7e7e9]"
                  : "border-transparent bg-white text-[#a8a8a8] hover:bg-[#e7e7e9]"
            }`}
            key={option}
            onClick={() => onSelect(selectionKey, option)}
            type="button"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

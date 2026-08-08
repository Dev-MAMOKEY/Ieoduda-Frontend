import type { StructuredPlan } from "../model/planTypes";

// 구조화된 계획의 선택 입력 필드를 화면용 한글 제목에 연결합니다.
const optionalFieldLabels: Partial<Record<keyof StructuredPlan, string>> = {
  message: "전달하는 메시지",
  socialAccount: "SNS 계정 처리",
  obituary: "부고 전달",
  workAccount: "업무 계정･이메일",
  workHandover: "업무 정리",
  objectionContact: "이의제기 연락처",
};

// AI 대화에서 정리된 계획 한 건의 필수·선택 정보를 카드로 표시합니다.
export function StructuredPlanCard({ plan }: { plan: StructuredPlan }) {
  // 값이 실제로 입력된 선택 필드만 카드에 표시할 목록으로 변환합니다.
  const optionalFields = Object.entries(optionalFieldLabels).flatMap(
    ([key, label]) => {
      const value = plan[key as keyof StructuredPlan];
      return typeof value === "string" && value ? [{ key, label, value }] : [];
    },
  );

  return (
    <article className="flex w-[318px] max-w-full flex-col gap-[19px] rounded-bl-[30px] rounded-br-[30px] rounded-tr-[30px] bg-[#d5d5d5] px-[22px] py-5 text-sm lg:w-auto lg:min-w-0 lg:gap-[26px] lg:px-[30px] lg:text-base">
      <div className="flex flex-col gap-2">
        <span className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-[#28292e] text-xs font-semibold lg:size-[26px] lg:text-sm">
          {plan.id}
        </span>
        <span className="font-medium text-[#838383]">원문 근거</span>
        <p className="truncate text-[#28292e]">{plan.source}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <strong className="text-[#28292e]">계획 이름</strong>
        <span className="font-medium text-[#838383]">{plan.name}</span>
      </div>

      {optionalFields.map((field) => (
        <div className="flex flex-col gap-2.5" key={field.key}>
          <strong className="text-[#28292e]">{field.label}</strong>
          <span className="font-medium text-[#838383]">{field.value}</span>
        </div>
      ))}

      <div className="flex flex-col gap-2.5">
        <strong className="text-[#28292e]">대기 기간</strong>
        <span className="font-medium text-[#838383]">{plan.waitingPeriod}</span>
      </div>

      <div className="mt-auto flex gap-3.5">
        {["승인", "수정", "삭제"].map((action) => (
          <button className="flex h-[45px] min-w-0 flex-1 items-center justify-center rounded-[20px] bg-[#a8a8a8] px-3 text-sm text-white transition-colors hover:bg-[#929292] lg:h-[52px] lg:rounded-[30px] lg:text-base" key={action} type="button">
            {action}
          </button>
        ))}
      </div>
    </article>
  );
}

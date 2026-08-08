// 계획 폼에서 버튼으로 선택하는 항목들의 필드 이름입니다.
export type PlanSelectionKey =
  | "socialAccount"
  | "obituary"
  | "workAccount"
  | "workHandover"
  | "waitingPeriod"
  | "objectionContact";

// 계획 작성·수정 폼이 관리하는 모든 입력값의 구조입니다.
export type PlanFormValues = Record<PlanSelectionKey, string> & {
  name: string;
  message: string;
};

// 계획 저장 전에 반드시 입력해야 하는 필드를 제한합니다.
export type RequiredPlanField = "name" | "waitingPeriod";

// 대화 결과로 생성된 계획 카드 한 개의 데이터 구조입니다.
export type StructuredPlan = Pick<PlanFormValues, RequiredPlanField> &
  Partial<Omit<PlanFormValues, RequiredPlanField>> & {
    id: number;
    source: string;
  };

import type { PlanFormValues } from "../model/planTypes";

// 새 계획 작성 시 폼에 사용하는 빈 초기값입니다.
export const emptyPlanValues: PlanFormValues = {
  name: "",
  message: "",
  socialAccount: "",
  obituary: "",
  workAccount: "",
  workHandover: "",
  waitingPeriod: "",
  objectionContact: "",
};

// 수정 모드에서 기존 계획을 불러온 상황을 표현하는 임시 초기값입니다.
export const existingPlanValues: PlanFormValues = {
  name: "나의 계획",
  message: "가족･친구･지인에게 전달할 메시지",
  socialAccount: "삭제",
  obituary: "전달",
  workAccount: "인수인계",
  workHandover: "인수인계",
  waitingPeriod: "14일",
  objectionContact: "등록",
};

// 계획의 각 선택형 필드에서 사용자에게 보여줄 선택지입니다.
export const planOptions = {
  socialAccount: ["삭제", "추모 전환", "비공개", "기타", "해당 없음"],
  obituary: ["전달", "전달 안함", "친한 지인"],
  workAccount: ["인수인계", "삭제"],
  workHandover: ["인수인계", "인계 안함"],
  waitingPeriod: ["7일", "14일", "22일"],
  objectionContact: ["등록", "등록 안함"],
} as const;

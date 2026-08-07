import type { PlanFormValues } from "../model/planTypes";

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

export const planOptions = {
  socialAccount: ["삭제", "추모 전환", "비공개", "기타", "해당 없음"],
  obituary: ["전달", "전달 안함", "친한 지인"],
  workAccount: ["인수인계", "삭제"],
  workHandover: ["인수인계", "인계 안함"],
  waitingPeriod: ["7일", "14일", "22일"],
  objectionContact: ["등록", "등록 안함"],
} as const;

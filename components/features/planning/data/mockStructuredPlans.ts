import type { StructuredPlan } from "../model/planTypes";

// 추후 백엔드 JSON 응답으로 교체할 계획 구조화 결과 목 데이터입니다.
// AI 대화 결과 카드 UI를 표시하기 위한 임시 구조화 계획 데이터입니다.
export const mockStructuredPlans: StructuredPlan[] = [
  {
    id: 1,
    source: "아내에게 가족사진 위치를 알려주고...",
    name: "가족 사진 전달",
    waitingPeriod: "14일",
    message: "가족 사진은 클라우드 보관함 2번째 파일에 있어.",
  },
  {
    id: 2,
    source: "민수에게 디자인 프로젝트를 인계한 뒤...",
    name: "디자인 프로젝트 인계",
    waitingPeriod: "14일",
    workAccount: "인수인계",
    workHandover: "김민수에게 디자인 프로젝트 인수인계",
  },
  {
    id: 3,
    source: "지수에게 SNS와 클라우드 정리를 부탁하고 싶...",
    name: "SNS 및 클라우드 정리",
    waitingPeriod: "7일",
    socialAccount: "비공개",
    objectionContact: "이지수",
  },
];

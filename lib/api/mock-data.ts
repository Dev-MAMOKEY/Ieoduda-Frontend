export const currentUser = {
  name: "김나무",
  email: "namu_k@gmail.com",
  birthDate: "92.10.04",
};

export const planOverview = {
  ownerName: "홍길동",
  unresolvedConflictCount: 1,
  items: [
    {
      title: "전달 메시지",
      description: "가족･친구･지인에게",
      status: "작성완료",
      icon: "/icons/plan/cards/message.svg",
    },
    {
      title: "관계 정리",
      description: "SNS 계정 /부고 전달",
      status: "작성완료",
      icon: "/icons/plan/cards/envelope.svg",
    },
    {
      title: "업무 정리",
      description: "디자인 프로젝트 인수인계",
      status: "작성완료",
      icon: "/icons/plan/cards/buildings.svg",
    },
    {
      title: "확인자",
      description: "유지민･박성호",
      status: "등록완료",
      icon: "/icons/plan/cards/users.svg",
    },
  ],
};

export const lifeAreaResults = [
  {
    id: 1,
    icon: "/icons/life-area/one.svg",
    source: "가족에게 가족사진 위치를 알려주고...",
    title: "가족에게 전달하는 메시지",
    detail: "가족 사진은 클라우드 보관함 2번째 파일에 있어.",
  },
  {
    id: 2,
    icon: "/icons/life-area/two.svg",
    source: "업무정리 담당자에게 디자인 프로젝트를 인계한...",
    title: "업무 정리",
    detail: "디자인 프로젝트 인수인계",
  },
  {
    id: 3,
    icon: "/icons/life-area/three.svg",
    source: "관계 정리 담당자에게 SNS와 클라우드 정리를 부탁...",
    title: "관계정리",
    detail: "SNS · 클라우드 비공개 처리",
  },
];

export const executionOrder = {
  conflictCount: 1,
  items: [
    {
      id: "cloud",
      title: "클라우드 정리",
      state: "삭제･충돌",
      manager: "이지수",
      waitingPeriod: "7일",
      approval: "수락 대기",
      conflict: true,
    },
    {
      id: "design",
      title: "디자인 파일 인수인계",
      state: "가능",
      manager: "김민수",
      waitingPeriod: "7일",
      approval: "수락 완료",
    },
    {
      id: "family-photo",
      title: "가족사진 파일 전달",
      state: "가능",
      manager: "유지민(아내)",
      waitingPeriod: "7일",
      approval: "수락 완료",
    },
  ],
};

export const emailAudit = {
  totalCount: 4,
  summary: ["완료 1", "반송 1", "OTP 실패 2회"],
  recipients: [
    {
      role: "관계 정리 담당",
      name: "이지수",
      email: "jisooo@naver.com",
      status: "완료",
      events: [
        ["발송", "AM 9:00"],
        ["열람", "AM 9:10"],
        ["완료", "AM 11:15"],
      ],
    },
    {
      role: "업무 정리 담당",
      name: "김민수",
      email: "minsookim1@naver.com",
      status: "반송",
      warning: true,
      events: [
        ["발송", "AM 10:00"],
        ["반송", "AM 10:30"],
        ["재시도", "PM 14:00"],
      ],
    },
    {
      role: "확인자",
      name: "유지민",
      email: "jimin_u@gmail.com",
      status: "OTP 실패 2회",
      warning: true,
      events: [
        ["발송", "AM 10:20"],
        ["반송", "AM 10:30"],
        ["재시도", "AM 11:45"],
      ],
    },
  ],
};

export const evidenceAuditRecords = [
  {
    title: "증빙 자료 1",
    status: "삭제 완료",
    dates: ["11.23", "12.01", "12.01"],
    hash: "a3f9c1e8…e2b04f7",
    fullHash: "a3f9c1e8e2b04f7",
  },
  {
    title: "증빙 자료 2",
    status: "삭제 실패",
    dates: ["11.25", "12.01", "-"],
    failed: true,
    failureReason: "저장소 무응답",
  },
];

export const externalReview = {
  document: { name: "사망 진단서.pdf", receivedAt: "26.11.14 11:50" },
  subject: { name: "김나무", birthDate: "92.10.04", matchStatus: "일치" },
};

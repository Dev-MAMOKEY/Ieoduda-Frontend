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

export const roleInspectionPeople = [
  {
    id: "jisu",
    name: "이지수",
    email: "jisooo@naver.com",
    status: "수락 대기",
    type: "manager",
    role: "관계 정리",
    summary: "SNS 계정 / 부고 전달",
    waitingPeriod: "7일",
    groups: [
      { title: "SNS 계정", tasks: [["인스타그램", "비공개 처리"], ["트위터", "계정 삭제"]] },
      { title: "부고 전달", tasks: [["문자 메시지", "연락처에 저장된 모든 전화번호"], ["카카오톡", "단체 톡방"]] },
    ],
  },
  {
    id: "minsu",
    name: "김민수",
    email: "minsu.kim@gmail.com",
    status: "수락 완료",
    type: "manager",
    role: "업무 정리",
    summary: "디자인 프로젝트 인수인계",
    waitingPeriod: "7일",
    groups: [
      { title: "작업 파일", tasks: [["피그마", "디자인 파일 소유권 이전"], ["구글 드라이브", "프로젝트 폴더 공유"]] },
    ],
  },
  { id: "jimin", name: "유지민", email: "jimin_u@gmail.com", status: "수락 대기", type: "verifier", role: "확인자", summary: "사용자 사망 확인 / 날짜 전달" },
  { id: "sungho", name: "박성호", email: "sungho.park@gmail.com", status: "수락 완료", type: "verifier", role: "확인자", summary: "사용자 사망 확인 / 날짜 전달" },
];

export const handoffInspectionPeople = [
  { name: "이지수", type: "담당자", ready: "준비 완료", role: "관계 정리", complete: true, checks: [["이메일", "도달 완료", true], ["역할", "수락 완료", true], ["대체 담당자", "없음", true]], question: "없음" },
  { name: "김민수", type: "담당자", ready: "준비 대기", role: "업무 정리", complete: false, checks: [["이메일", "도달 완료", true], ["역할", "수락 대기", false], ["대체 담당자", "없음", false]], question: "말씀하신 디자인 프로젝트 저 혼자 인계받는 건가요?\n팀에 같이 넘겨야 할 사람이 있으면 미리 알아두고 싶어요." },
  { name: "유지민", type: "확인자", ready: "준비 대기", role: "관계 정리", complete: true, checks: [["이메일", "도달 완료", true], ["역할", "수락 완료", true]], question: "없음" },
  { name: "박성호", type: "확인자", ready: "준비 완료", role: "관계 정리", complete: true, checks: [["이메일", "도달 완료", true], ["역할", "수락 완료", true]], question: "없음" },
];

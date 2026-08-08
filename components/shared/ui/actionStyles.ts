// 로그인(/), 회원가입(/signup), 서비스 설명(/service-description),
// 제한 정보 안내(/restricted-information) 화면의 확인·제출 동작 버튼에 사용됩니다.
// 항상 활성화된 주요 동작 버튼에 적용하는 공통 스타일입니다.
export const primaryActionClassName =
  "flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors hover:bg-[#929292] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28292e] lg:h-[52px] lg:rounded-[30px] lg:text-base";

// 사후 인계 필수 동의(/handover-agreement) 화면의 확인 버튼에 사용됩니다.
// 모든 필수 항목에 동의하기 전에는 비활성화 상태를 표시합니다.
// 조건에 따라 활성·비활성 표현이 달라지는 동작 버튼의 공통 스타일입니다.
export const conditionalActionClassName =
  "flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors enabled:hover:bg-[#929292] disabled:cursor-not-allowed disabled:opacity-45 lg:h-[52px] lg:rounded-[30px] lg:text-base";

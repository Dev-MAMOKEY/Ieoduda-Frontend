// 여러 화면의 기본 CTA와 활성화 조건이 있는 CTA가 공유하는 Tailwind 클래스를 제공합니다.
export const primaryActionClassName =
  "flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors hover:bg-[#929292] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28292e] lg:h-[52px] lg:rounded-[30px] lg:text-base";

export const conditionalActionClassName =
  "flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors enabled:hover:bg-[#929292] disabled:cursor-not-allowed disabled:opacity-45 lg:h-[52px] lg:rounded-[30px] lg:text-base";

// 데스크톱 화면에서 공통으로 사용하는 브랜드, 내비게이션, 사용자 상태 헤더입니다.
import Image from "next/image";

// 데스크톱 헤더에 표시할 주요 화면의 탐색 항목입니다.
const navigationItems = [
  { src: "/icons/layout/header/home-outline.svg", label: "홈", size: 28 },
  { src: "/icons/layout/header/inspection.svg", label: "점검", size: 24 },
  { src: "/icons/layout/header/profile.svg", label: "설정", size: 24 },
];

// 로그인 여부에 따라 헤더의 사용자 동작을 바꾸기 위한 속성입니다.
type DesktopHeaderProps = {
  authenticated?: boolean;
};

// 큰 화면에서 로고, 주요 메뉴, 인증 관련 동작을 제공하는 공통 헤더입니다.
export function DesktopHeader({ authenticated = false }: DesktopHeaderProps) {
  return (
    <header className="hidden h-[125px] w-full items-center justify-between px-[50px] pb-5 pt-6 lg:flex">
      <div className="flex h-[81px] flex-1 items-center">
        <span className="p-2 text-[22px] font-semibold text-[#28292e]">
          이어두다
        </span>
      </div>

      <nav
        aria-label="주요 메뉴"
        className="flex w-[240px] items-center justify-between rounded-[40px] border-[1.2px] border-[#d9d9d9] bg-white p-[10px]"
      >
        {navigationItems.map((item) => (
          <span
            className="flex size-11 items-center justify-center rounded-[30px]"
            key={item.label}
            title={item.label}
          >
            <Image
              src={item.src}
              alt=""
              width={item.size}
              height={item.size}
            />
          </span>
        ))}
      </nav>

      <div className="flex h-[81px] flex-1 items-center justify-end">
        <div className="flex items-center gap-[30px]">
          <div className="flex items-center gap-[14px]">
            <span className="size-[43px] rounded-full bg-[#d9d9d9]" />
            <div className="flex flex-col gap-0.5">
              <strong className="text-lg font-semibold text-[#28292e]">
                {authenticated ? "김나무" : "비회원"}
              </strong>
              <span className="text-sm text-[#a8a8a8]">
                {authenticated ? "namu_k@gmail.com" : "로그인을 해주세요"}
              </span>
            </div>
          </div>
          {authenticated && (
            <div className="flex items-center gap-5">
              <Image src="/icons/layout/header/bell.svg" alt="알림" width={24} height={24} />
              <Image src="/icons/layout/header/moon.svg" alt="다크 모드" width={24} height={24} />
              <Image src="/icons/layout/header/sign-out.svg" alt="로그아웃" width={24} height={24} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

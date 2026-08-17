import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { getCurrentUser } from "@/lib/api";
import { LogoutButton } from "@/components/LogoutButton";

const tabs = [
  {
    id: "home",
    label: "홈",
    href: "/plan",
    icon: "/icons/layout/header/home-outline.svg",
  },
  {
    id: "inspection",
    label: "점검",
    href: "/role",
    icon: "/icons/layout/header/inspection.svg",
  },
  {
    id: "settings",
    label: "설정",
    href: "/profile",
    icon: "/icons/layout/header/profile.svg",
  },
];

export function DesktopHeader({
  authenticated = false,
  showNavigation = false,
  activeTab = "home",
}: { authenticated?: boolean; showNavigation?: boolean; activeTab?: string }) {
  const user = getCurrentUser();
  return (
    <header className="hidden h-[125px] w-full shrink-0 grid-cols-3 items-center px-[50px] md:grid xl:px-[120px]">
      <BrandLogo />
      <div className="flex justify-center">
        {showNavigation && (
          <nav
            aria-label="주요 메뉴"
            className="flex h-[66px] w-[240px] items-center justify-between rounded-[40px] border-[1.2px] border-[#d9d9d9] bg-white p-2.5"
          >
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              const iconSize = tab.id === "home" ? 28 : 24;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={tab.label}
                  className={`flex h-11 items-center justify-center rounded-[30px] ${active ? `gap-2 pl-2.5 pr-3 ${tab.id === "inspection" ? "bg-[#d9d9d9]" : "bg-[#e7e7e7]"}` : "w-11"}`}
                >
                  <Image
                    alt=""
                    className={tab.id === "home" ? "size-7" : "size-6"}
                    width={iconSize}
                    height={iconSize}
                    src={tab.icon}
                  />
                  {active && (
                    <span className="text-[13px] font-semibold text-[#6e6e6e]">
                      {tab.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
      <div className="flex items-center justify-end gap-[30px]">
        <div className="flex items-center gap-3.5">
          <div className="size-[43px] rounded-full bg-[#d9d9d9]" />
          <div className="flex flex-col gap-0.5">
            <strong className="text-lg font-semibold">
              {authenticated ? user.name : "비회원"}
            </strong>
            <span className="text-sm text-[#a8a8a8]">
              {authenticated ? user.email : "로그인해 주세요"}
            </span>
          </div>
        </div>
        {authenticated && (
          <LogoutButton />
        )}
      </div>
    </header>
  );
}

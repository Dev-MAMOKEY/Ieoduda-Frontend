"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { LogoutButton } from "@/components/LogoutButton";
import { useCurrentUser } from "@/lib/hooks/use-current-user";

const tabs = [
  { id: "home", label: "홈", href: "/plan", icon: "/icons/plan-home/figma/home.svg" },
  { id: "inspection", label: "점검", href: "/role", icon: "/icons/plan-home/figma/inspection.svg" },
  { id: "settings", label: "설정", href: "/profile", icon: "/icons/plan-home/figma/settings.svg" },
];

export function DesktopHeader({ authenticated = false, showNavigation = false, activeTab = "home" }: { authenticated?: boolean; showNavigation?: boolean; activeTab?: string }) {
  const { user } = useCurrentUser(authenticated);
  return (
    <header className={`relative hidden h-[125px] w-full shrink-0 grid-cols-3 items-center px-[50px] xl:px-[120px] ${showNavigation ? "lg:grid" : "md:grid"}`}>
      <BrandLogo />
      <div className="flex justify-center">
        {showNavigation && (
          <nav aria-label="주요 메뉴" className="flex shrink-0 items-center gap-[14px] rounded-[30px] border-[1.4px] border-[#e2dafa] bg-[#fbfafd] py-2 pl-3 pr-2">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return <Link key={tab.id} href={tab.href} aria-current={active ? "page" : undefined} aria-label={tab.label} className={`flex items-center justify-center rounded-[30px] py-1 ${active ? "gap-2 bg-[#e2dafa] pl-2.5 pr-3" : "px-2.5"}`}><Image alt="" className="size-6" width={24} height={24} src={tab.icon} />{active && <span className="text-[13px] font-semibold leading-none text-[#43306d]">{tab.label}</span>}</Link>;
            })}
          </nav>
        )}
      </div>
      <div className="flex shrink-0 items-center justify-end gap-[30px]">
        <div className="flex shrink-0 items-center gap-3.5"><div className="size-[43px] shrink-0 rounded-full bg-[#f3f3ff]" /><div className="flex shrink-0 flex-col gap-1"><strong className="text-lg font-bold leading-none text-[#43306d]">{authenticated ? user?.name ?? "사용자" : "비회원"}</strong><span className="text-[15px] font-medium leading-none text-[#796b6c]">{authenticated ? user?.email ?? "불러오는 중" : "로그인해 주세요"}</span></div></div>
        {authenticated && <LogoutButton />}
      </div>
    </header>
  );
}

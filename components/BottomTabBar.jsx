import Image from "next/image";
import Link from "next/link";

const tabs = [
  { id: "home", label: "홈", href: "/plan", icon: "/icons/layout/header/home-outline.svg" },
  { id: "inspection", label: "점검", href: "/role", icon: "/icons/layout/header/inspection.svg" },
  { id: "settings", label: "설정", href: "/profile", icon: "/icons/layout/header/profile.svg" },
];

export function BottomTabBar({ activeTab }) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-50 flex h-[66px] w-[240px] -translate-x-1/2 items-center justify-between overflow-hidden rounded-[40px] border-[1.2px] border-solid border-[#d9d9d9] bg-white p-2.5 shadow-[0_1px_3px_rgba(40,41,46,0.06)]"
      data-node-id="513:3059"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            aria-label={tab.label}
            className={`flex h-11 items-center justify-center overflow-hidden rounded-[30px] transition-colors ${
              isActive
                ? `gap-2 pl-2.5 pr-3 ${tab.id === "inspection" ? "bg-[#d9d9d9]" : "bg-[#e7e7e7]"}`
                : "w-11"
            }`}
            href={tab.href}
            key={tab.id}
          >
            <Image alt="" className="size-6 shrink-0" height={24} src={tab.icon} width={24} />
            {isActive && <span className="text-[13px] font-semibold leading-none text-[#6e6e6e]">{tab.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

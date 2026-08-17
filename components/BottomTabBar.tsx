import Image from "next/image";
import Link from "next/link";

const tabs = [
  { id: "home", label: "홈", href: "/plan", icon: "/icons/plan-home/figma/home.svg" },
  { id: "inspection", label: "점검", href: "/role", icon: "/icons/plan-home/figma/inspection.svg" },
  { id: "settings", label: "설정", href: "/profile", icon: "/icons/plan-home/figma/settings.svg" },
];

export function BottomTabBar({ activeTab, className = "" }: { activeTab: string; className?: string }) {
  return (
    <nav aria-label="주요 메뉴" className={`fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-50 flex min-h-[60px] -translate-x-1/2 items-center gap-[14px] rounded-[30px] border-[1.4px] border-[#e2dafa] bg-[#fbfafd]/95 py-2 pl-3 pr-2 shadow-[0_4px_16px_rgba(67,48,109,0.12)] backdrop-blur-sm md:hidden ${className}`} data-node-id="513:3059">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return <Link aria-current={isActive ? "page" : undefined} aria-label={tab.label} className={`flex min-h-10 items-center justify-center rounded-[30px] py-1 transition-colors ${isActive ? "gap-2 bg-[#e2dafa] pl-2.5 pr-3" : "px-2.5"}`} href={tab.href} key={tab.id}><Image alt="" className="size-6 shrink-0" height={24} src={tab.icon} width={24} />{isActive && <span className="text-[13px] font-semibold leading-none text-[#43306d]">{tab.label}</span>}</Link>;
      })}
    </nav>
  );
}

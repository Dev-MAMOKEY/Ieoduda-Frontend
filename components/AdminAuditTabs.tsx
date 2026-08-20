import Link from "next/link";

const tabs = [
  { id: "evidence", label: "증빙 삭제 감사", href: "/admin/evidence" },
  { id: "email", label: "이메일 발송 감사", href: "/admin/email" },
];

export function AdminAuditTabs({ active, desktop = false }: { active: string; desktop?: boolean }) {
  return <nav aria-label="관리자 감사 메뉴" className={`items-center justify-center gap-5 whitespace-nowrap ${desktop ? "hidden lg:flex" : "flex lg:hidden"}`}>
    {tabs.map((tab) => <Link
      aria-current={active === tab.id ? "page" : undefined}
      className={`shrink-0 pb-1 font-bold leading-none transition-colors hover:text-[#796b6c] ${desktop ? "text-xl" : "text-sm"} ${active === tab.id ? `${desktop ? "border-b-[1.4px]" : "border-b-[1.2px]"} border-[#43306d] text-[#43306d]` : "text-[#a99d9e]"}`}
      href={tab.href}
      key={tab.id}
    >{tab.label}</Link>)}
  </nav>;
}

import Link from "next/link";

const tabs = [
  { id: "evidence", label: "증빙 삭제 감사", href: "/admin/evidence" },
  { id: "email", label: "이메일 발송 감사", href: "/admin/email" },
];

export function AdminAuditTabs({ active, desktop = false }) {
  return <nav aria-label="관리자 메뉴" className={`items-center justify-center gap-5 ${desktop ? "hidden lg:flex" : "flex lg:hidden"}`}>{tabs.map((tab) => <Link aria-current={active === tab.id ? "page" : undefined} className={`pb-1 font-semibold transition-colors duration-200 hover:text-[#6e6e6e] ${desktop ? "text-xl" : "text-sm"} ${active === tab.id ? `${desktop ? "border-b-[1.4px]" : "border-b-[1.2px]"} border-[#28292e] text-[#28292e]` : "text-[#a8a8a8]"}`} href={tab.href} key={tab.id}>{tab.label}</Link>)}</nav>;
}

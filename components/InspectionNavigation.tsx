import Link from "next/link";

const items = [
  { id: "role", label: "역할 점검", href: "/role" },
  { id: "handoff", label: "인계 점검", href: "/handoff" },
];

export function InspectionNavigation({ active }: { active: "role" | "handoff" }) {
  return (
    <nav aria-label="점검 종류" className="flex gap-[30px] md:gap-9">
      {items.map((item) => (
        <Link
          aria-current={active === item.id ? "page" : undefined}
          className={`pb-1 text-base font-bold md:text-lg ${active === item.id ? "border-b-[1.2px] border-[#28292e]" : "text-[#a8a8a8]"}`}
          href={item.href}
          key={item.id}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

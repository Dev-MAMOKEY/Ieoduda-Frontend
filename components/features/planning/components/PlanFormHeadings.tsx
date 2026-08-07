import type { ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="px-2.5 text-base font-bold text-[#28292e]">{children}</h2>;
}

export function Subsection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="px-2.5 text-sm font-medium text-[#28292e]">{label}</h3>
      {children}
    </div>
  );
}

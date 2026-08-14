import { InspectionDesktopHeader } from "@/components/InspectionDesktopHeader";
import type { ReactNode } from "react";

export default function InspectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f0f0f2]">
      <div className="hidden md:block">
        <InspectionDesktopHeader />
      </div>
      {children}
    </div>
  );
}

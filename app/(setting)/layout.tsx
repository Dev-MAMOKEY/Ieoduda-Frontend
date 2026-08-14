import { SettingDesktopHeader } from "@/components/SettingDesktopHeader";
import type { ReactNode } from "react";

export default function SettingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f0f0f2]">
      <div className="hidden md:block">
        <SettingDesktopHeader />
      </div>
      {children}
    </div>
  );
}

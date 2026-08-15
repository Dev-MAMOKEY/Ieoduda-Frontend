import { SettingDesktopHeader } from "@/components/SettingDesktopHeader";
import { AuthGuard } from "@/components/AuthGuard";
import type { ReactNode } from "react";

export default function SettingLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-dvh bg-[#f0f0f2]">
        <div className="hidden md:block">
          <SettingDesktopHeader />
        </div>
        {children}
      </div>
    </AuthGuard>
  );
}

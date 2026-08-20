import { HomeDesktopHeader } from "@/components/HomeDesktopHeader";
import { AuthGuard } from "@/components/AuthGuard";
import type { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-dvh bg-[#f0f0f2] md:[&>main]:min-h-[calc(100dvh-125px)] md:[&>main]:max-w-none md:[&>main]:px-[140px] md:[&>main]:py-[50px]">
        <HomeDesktopHeader />
        {children}
      </div>
    </AuthGuard>
  );
}

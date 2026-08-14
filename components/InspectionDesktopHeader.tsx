"use client";

import { usePathname } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";

export function InspectionDesktopHeader() {
  const pathname = usePathname();
  const isRoleOverview = pathname === "/role" || pathname === "/handoff";

  return (
    <DesktopHeader
      authenticated
      showNavigation={isRoleOverview}
      activeTab="inspection"
    />
  );
}

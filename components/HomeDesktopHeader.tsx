"use client";

import { usePathname } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";

export function HomeDesktopHeader() {
  const pathname = usePathname();

  return (
    <DesktopHeader
      authenticated
      showNavigation={pathname === "/plan"}
      activeTab="home"
    />
  );
}

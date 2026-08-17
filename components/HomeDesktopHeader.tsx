"use client";

import { usePathname } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";

export function HomeDesktopHeader() {
  const pathname = usePathname();

  if (pathname === "/plan" || pathname === "/plan-info" || pathname === "/verifier") {
    return null;
  }

  return (
    <DesktopHeader
      authenticated
      showNavigation={pathname === "/plan"}
      activeTab="home"
    />
  );
}

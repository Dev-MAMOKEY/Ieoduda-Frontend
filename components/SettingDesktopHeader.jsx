"use client";

import { usePathname } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";

export function SettingDesktopHeader() {
  const pathname = usePathname();
  return <DesktopHeader authenticated showNavigation={pathname === "/profile"} activeTab="settings" />;
}

"use client";

import { usePathname } from "next/navigation";
import { DesktopHeader } from "@/components/DesktopHeader";

export function HomeDesktopHeader() {
  const pathname = usePathname();

  if (pathname === "/plan") {
    return null;
  }

  return (
    <DesktopHeader
      authenticated
    />
  );
}

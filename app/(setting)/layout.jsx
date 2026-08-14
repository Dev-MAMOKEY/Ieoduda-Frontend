import { SettingDesktopHeader } from "@/components/SettingDesktopHeader";

export default function SettingLayout({ children }) {
  return <div className="min-h-dvh bg-[#f0f0f2]"><div className="hidden lg:block"><SettingDesktopHeader /></div>{children}</div>;
}

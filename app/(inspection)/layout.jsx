import { InspectionDesktopHeader } from "@/components/InspectionDesktopHeader";

export default function InspectionLayout({ children }) {
  return <div className="min-h-dvh bg-[#f0f0f2]">
    <div className="hidden lg:block"><InspectionDesktopHeader /></div>
    {children}
  </div>;
}

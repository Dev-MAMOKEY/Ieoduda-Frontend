import { HomeDesktopHeader } from "@/components/HomeDesktopHeader";

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-dvh bg-[#f0f0f2] md:[&>main]:min-h-[calc(100dvh-125px)] md:[&>main]:max-w-none md:[&>main]:px-[140px] md:[&>main]:py-[50px]">
      <HomeDesktopHeader />
      {children}
    </div>
  );
}

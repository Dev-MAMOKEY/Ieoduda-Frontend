import { BrandLogo } from "@/components/BrandLogo";

type LogoHeaderProps = {
  className?: string;
};

export function LogoHeader({ className = "" }: LogoHeaderProps) {
  return (
    <header
      className={`flex h-[125px] w-full shrink-0 items-center px-[50px] xl:px-[120px] ${className}`}
    >
      <BrandLogo />
    </header>
  );
}

import { BrandLogo } from "@/components/BrandLogo";

type LogoHeaderProps = {
  href?: string;
  className?: string;
};

export function LogoHeader({ href = "/", className = "" }: LogoHeaderProps) {
  return (
    <header
      className={`flex h-[125px] w-full shrink-0 items-center px-[50px] xl:px-[120px] ${className}`}
    >
      <BrandLogo href={href} />
    </header>
  );
}


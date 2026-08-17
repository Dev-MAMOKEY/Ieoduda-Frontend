import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
};

function LogoText({ className = "" }: Pick<BrandLogoProps, "className">) {
  return (
    <span
      className={`flex items-end gap-[6px] overflow-hidden whitespace-nowrap font-bold leading-none text-[#43306d] ${className}`}
      aria-label="이어두다"
    >
      <span aria-hidden className="text-[46px] tracking-[-6.9px]">
        ieoduda
      </span>
      <span aria-hidden className="text-[20px]">
        이어두다
      </span>
    </span>
  );
}

export function BrandLogo({ href, className = "" }: BrandLogoProps) {
  if (href) {
    return (
      <Link href={href} className="w-fit" aria-label="이어두다 홈으로 이동">
        <LogoText className={className} />
      </Link>
    );
  }

  return <LogoText className={className} />;
}


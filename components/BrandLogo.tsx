type BrandLogoProps = { className?: string };

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return <span className={`flex items-end gap-[6px] overflow-hidden whitespace-nowrap font-bold leading-none text-[#43306d] ${className}`} aria-label="이어두다"><span aria-hidden className="text-[46px] tracking-[-6.9px]">ieoduda</span><span aria-hidden className="text-[20px]">이어두다</span></span>;
}

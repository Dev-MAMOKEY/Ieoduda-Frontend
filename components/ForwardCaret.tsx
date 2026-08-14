import Image from "next/image";

export function ForwardCaret({ className = "" }: { className?: string }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`size-[18px] shrink-0 rotate-180 scale-y-[-1] ${className}`}
      height={18}
      src="/icons/plan/navigation/conflict-caret.svg"
      width={18}
    />
  );
}

"use client";

// 모든 화면에서 동일한 크기와 클릭 영역으로 사용하는 공통 뒤로가기 버튼입니다.
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  href?: string;
  label?: string;
};

const className =
  "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#e1e1e3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28292e]";

const icon = (
  <Image
    className="size-6 rotate-180 lg:size-7"
    src="/icons/common/caret-right.svg"
    alt=""
    width={28}
    height={28}
  />
);

export function BackButton({ href, label = "이전 화면으로 돌아가기" }: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link aria-label={label} className={className} href={href}>
        {icon}
      </Link>
    );
  }

  return (
    <button aria-label={label} className={className} onClick={() => router.back()} type="button">
      {icon}
    </button>
  );
}

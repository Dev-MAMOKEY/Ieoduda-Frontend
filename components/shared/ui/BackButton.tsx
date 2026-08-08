"use client";

// 모든 화면에서 동일한 크기와 클릭 영역으로 사용하는 공통 뒤로가기 버튼입니다.
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 뒤로 가기 링크의 목적지와 접근성 문구를 정의합니다.
type BackButtonProps = {
  href?: string;
  label?: string;
};

// 링크와 일반 버튼이 같은 모양을 사용하도록 공유하는 스타일입니다.
const className =
  "flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#e1e1e3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#28292e]";

// 모든 뒤로 가기 버튼에서 재사용하는 화살표 아이콘입니다.
const icon = (
  <Image
    className="size-6 rotate-180 lg:size-7"
    src="/icons/common/caret-right.svg"
    alt=""
    width={28}
    height={28}
  />
);

// href가 있으면 링크로, 없으면 브라우저 이전 이동 버튼으로 동작합니다.
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

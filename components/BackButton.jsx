"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BackButton({ href, label = "이전 화면으로 돌아가기", history = false }) {
  const router = useRouter();

  return (
    <Link
      aria-label={label}
      className="flex size-6 items-center justify-center rounded-full transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383]"
      href={href}
      onClick={history ? (event) => {
        event.preventDefault();
        router.back();
      } : undefined}
    >
      <Image className="rotate-180" src="/icons/common/caret-right.svg" alt="" width={24} height={24} />
    </Link>
  );
}

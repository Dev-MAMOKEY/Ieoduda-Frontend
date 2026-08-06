// 제목, 설명 문구, 다음 단계 버튼으로 이루어진 재사용 가능한 안내 카드입니다.
import Link from "next/link";
import { primaryActionClassName } from "@/components/shared/ui/actionStyles";

type InfoCardProps = {
  title: string;
  lines: readonly string[];
  href: string;
};

export function InfoCard({ title, lines, href }: InfoCardProps) {
  return (
    <article className="flex w-full max-w-[340px] flex-col items-center justify-center gap-6 overflow-hidden rounded-[30px] bg-white px-6 pb-[30px] pt-10 lg:max-w-[460px] lg:gap-10 lg:px-10">
      <div className="flex flex-col items-center gap-3 text-center lg:gap-[14px]">
        <h1 className="text-base font-bold text-[#28292e] lg:text-lg">{title}</h1>
        <div className="flex flex-col gap-1.5 text-sm font-medium text-[#838383] lg:gap-2 lg:text-base">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
      <Link
        className={primaryActionClassName}
        href={href}
      >
        확인하기
      </Link>
    </article>
  );
}

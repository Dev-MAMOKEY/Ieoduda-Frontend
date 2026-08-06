// 계획 항목의 아이콘, 설명, 선택적 상태를 일반형 또는 축약형 카드로 표시합니다.
import Image from "next/image";

type PlanCardProps = {
  title: string;
  description: string;
  icon: string;
  status?: string;
  compact?: boolean;
};

export function PlanCard({
  title,
  description,
  icon,
  status,
  compact = false,
}: PlanCardProps) {
  return (
    <article
      className={`flex w-full rounded-[20px] bg-white px-5 py-[18px] ${
        compact
          ? "min-h-[113px] flex-col items-start gap-2 lg:min-h-[113px]"
          : "min-h-[114px] items-center justify-between"
      }`}
    >
      <div className={`flex flex-col items-start ${compact ? "gap-2" : "gap-3"}`}>
        <Image src={icon} alt="" width={24} height={24} />
        <div className="flex flex-col gap-2.5">
          <h2 className="text-base font-bold text-[#28292e]">{title}</h2>
          <p className="text-sm font-medium text-[#838383]">{description}</p>
        </div>
      </div>
      {status && (
        <span className={`${compact ? "mt-auto" : ""} text-sm font-medium text-[#a8a8a8]`}>
          {status}
        </span>
      )}
    </article>
  );
}

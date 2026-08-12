import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

const planItems = [
  {
    title: "전달 메시지",
    description: "가족･친구･지인에게",
    status: "작성완료",
    icon: "/icons/plan/cards/message.svg",
  },
  {
    title: "관계 정리",
    description: "SNS 계정 /부고 전달",
    status: "작성완료",
    icon: "/icons/plan/cards/envelope.svg",
  },
  {
    title: "업무 정리",
    description: "디자인 프로젝트 인수인계",
    status: "작성완료",
    icon: "/icons/plan/cards/buildings.svg",
  },
  {
    title: "확인자",
    description: "유지민･박성호",
    status: "등록완료",
    icon: "/icons/plan/cards/users.svg",
  },
];

function PlanCard({ title, description, status, icon }) {
  return (
    <article className="flex min-h-[114px] w-full items-center justify-between rounded-[20px] bg-white px-5 py-[18px]">
      <div className="flex flex-col items-start gap-3">
        <Image src={icon} alt="" width={24} height={24} />
        <div className="flex flex-col gap-2.5">
          <h2 className="text-base font-bold">{title}</h2>
          <p className="text-sm font-medium text-[#838383]">{description}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-[#a8a8a8]">{status}</span>
    </article>
  );
}

export default function PlanPage() {
  return (
    <PageContainer
      className="items-center gap-[22px] pb-[100px] pt-[70px]"
      data-node-id="439:1315"
    >
      <PageHeader title="홈" className="pb-2.5" />

      <section className="flex w-full flex-col items-center gap-3.5 pb-2.5 text-center">
        <h2 className="text-xl font-bold">홍길동님, 반가워요</h2>
        <div className="flex flex-col gap-1 text-sm font-medium text-[#838383]">
          <p>지금은 계획 대기 중이에요</p>
          <p>평상시엔 아무 일도 일어나지 않아요</p>
        </div>
      </section>

      <div className="flex w-full gap-5 py-1.5">
        <Button className="min-w-0 flex-1" href="/life-area">
          계획 수정하기
        </Button>
        <Button className="min-w-0 flex-1" href="/manager">
          담당자 추가하기
        </Button>
      </div>

      <Link
        className="flex min-h-[60px] w-full items-center justify-between rounded-[20px] bg-[#d9d9d9] px-5 py-[18px] text-left"
        href="/order"
      >
        <span className="flex items-center gap-1.5 text-base font-bold">
          <Image src="/icons/plan/cards/warning.svg" alt="" width={24} height={24} />
          미해결 충돌
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-[#838383]">
          1건
          <Image
            className="rotate-180 scale-y-[-1]"
            src="/icons/plan/navigation/conflict-caret.svg"
            alt=""
            width={18}
            height={18}
          />
        </span>
      </Link>

      {planItems.map((item) => (
        <PlanCard key={item.title} {...item} />
      ))}
    </PageContainer>
  );
}

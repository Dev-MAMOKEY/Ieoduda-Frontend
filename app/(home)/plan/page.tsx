import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ForwardCaret } from "@/components/ForwardCaret";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { BottomTabBar } from "@/components/BottomTabBar";
import { getPlanOverview } from "@/lib/api";

function PlanCard({ title, description, status, icon }: { title: string; description: string; status: string; icon: string }) {
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
  const plan = getPlanOverview();
  return (
    <PageContainer
      className="items-center gap-[22px] pb-[100px] pt-[70px]"
      data-node-id="439:1315"
    >
      <PageHeader title="홈" className="pb-2.5" />

      <section className="flex w-full flex-col items-center gap-3.5 pb-2.5 text-center">
        <h2 className="text-xl font-bold">{plan.ownerName}님, 반가워요</h2>
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
        className="flex min-h-[60px] w-full items-center justify-between rounded-[20px] bg-[#d9d9d9] px-5 py-[18px] text-left transition-colors hover:bg-[#c9c9cb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383]"
        href="/order"
      >
        <span className="flex items-center gap-1.5 text-base font-bold">
          <Image
            src="/icons/plan/cards/warning.svg"
            alt=""
            width={24}
            height={24}
          />
          미해결 충돌
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-[#838383]">
          {plan.unresolvedConflictCount}건
          <ForwardCaret />
        </span>
      </Link>

      {plan.items.map((item) => (
        <PlanCard key={item.title} {...item} />
      ))}
      <BottomTabBar activeTab="home" />
    </PageContainer>
  );
}

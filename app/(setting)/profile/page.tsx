import Image from "next/image";
import Link from "next/link";
import { ForwardCaret } from "@/components/ForwardCaret";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { UserProfileSummary } from "@/components/UserProfileSummary";
import { BottomTabBar } from "@/components/BottomTabBar";
import type { ReactNode } from "react";

const plans = [
  { label: "계획 버전" },
  { label: "담당자 수락", href: "/role?person=jisu" },
  { label: "확인자 수락", href: "/role?person=jimin" },
  { label: "대기 이의제기", href: "/appeal" },
];
const cleanup = [
  {
    label: "계획 비활성화",
    description: "실행만 멈춰요. 데이터는 남고 언제든 다시 켤 수 있어요",
  },
  {
    label: "계정 삭제",
    description: (
      <>
        계정·모든 계획이 영구 삭제돼요
        <br />
        담당자·확인자에겐 역할 해제가 안내돼요. 되돌릴 수 없어요
      </>
    ),
  },
];

function Row({
  label,
  value = undefined,
  description = undefined,
  href = undefined,
}: { label: string; value?: string; description?: ReactNode; href?: string }) {
  const inside = (
    <>
      <span className={`flex min-w-0 flex-1 flex-col ${description ? "gap-[7px]" : ""}`}>
        <strong className="text-sm font-bold text-[#43306d] lg:text-[17px] lg:font-semibold">{label}</strong>
        {description && (
          <span className="text-xs font-medium leading-normal text-[#584e4d] lg:text-sm">
            {description}
          </span>
        )}
      </span>
      {value && (
        <span className="mr-2.5 text-xs font-medium text-[#838383] lg:text-sm">
          {value}
        </span>
      )}
      <ForwardCaret className="lg:size-5" />
    </>
  );
  const cls = "flex min-h-[62px] w-full items-center justify-between rounded-[14px] bg-white px-5 py-[22px] text-left lg:min-h-[65px] lg:py-6";
  return href ? (
    <Link className={cls} href={href}>
      {inside}
    </Link>
  ) : (
    <button className={`${cls} border-0`} type="button">
      {inside}
    </button>
  );
}
function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`flex w-full flex-col gap-3.5 lg:gap-[22px] ${className}`}>
      <h2 className="text-base font-bold text-[#43306d] lg:text-lg">{title}</h2>
      {children}
    </section>
  );
}

export default function ProfileSettingsPage() {
  return (
    <PageContainer
      className="items-center gap-0 pb-[100px] pt-[70px] lg:min-h-[calc(100dvh-125px)] lg:max-w-none lg:px-[120px] lg:pb-20 lg:pt-0"
      data-node-id="439:4905"
    >
      <PageHeader title="설정" />
      <div className="mx-auto flex w-full max-w-[342px] flex-col items-center gap-5 pt-5 lg:max-w-[460px] lg:gap-10 lg:pt-[50px]">
        <UserProfileSummary />
        <div className="flex w-full flex-col gap-7 lg:gap-5">
        <Section
          className="order-1"
          title="계정 관리"
        >
          <div className="flex flex-col gap-3 lg:gap-[22px]">
            <div className="hidden lg:block"><Row label="계획 비활성화" /></div>
            <Link className="flex min-h-[62px] items-center justify-between rounded-[14px] bg-white px-5 py-[22px] lg:min-h-[65px] lg:py-6" href="/login">
              <strong className="text-sm font-bold text-[#43306d] lg:text-[17px] lg:font-semibold">로그아웃</strong>
              <Image alt="" className="size-[18px] lg:size-5" width={20} height={20} src="/icons/settings/sign-out.svg" />
            </Link>
          </div>
        </Section>
        <Section
          className="order-2 lg:order-3"
          title="계획 관리"
        >
          <div className="flex flex-col gap-3">
            {plans.map((x) => (
              <Row key={x.label} {...x} />
            ))}
          </div>
        </Section>
        <Section
          className="order-3 lg:order-2"
          title="계획･계정 정리"
        >
          <div className="flex flex-col gap-3 lg:gap-[22px]">
            {cleanup.map((x) => (
              <Row key={x.label} {...x} />
            ))}
          </div>
        </Section>
        </div>
      </div>
      <BottomTabBar activeTab="settings" />
    </PageContainer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ForwardCaret } from "@/components/ForwardCaret";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { UserProfileSummary } from "@/components/UserProfileSummary";
import { BottomTabBar } from "@/components/BottomTabBar";
import type { ReactNode } from "react";

const plans = [
  { label: "계획 버전", value: "v2" },
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
      <span
        className={`flex min-w-0 flex-1 flex-col ${description ? "gap-2" : ""}`}
      >
        <strong className="text-sm lg:text-base">{label}</strong>
        {description && (
          <span className="text-xs font-medium leading-relaxed text-[#838383] lg:text-sm">
            {description}
          </span>
        )}
      </span>
      {value && (
        <span className="mr-2.5 text-xs font-medium text-[#838383] lg:text-sm">
          {value}
        </span>
      )}
      <ForwardCaret />
    </>
  );
  const cls = `flex w-full items-center justify-between rounded-[20px] bg-white px-5 text-left ${description ? "min-h-[77px] py-[22px]" : "h-[57px]"}`;
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
    <section className={`flex flex-col gap-3.5 md:gap-[22px] ${className}`}>
      <h2 className="text-sm font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function ProfileSettingsPage() {
  return (
    <PageContainer
      className="items-center gap-[22px] pb-[100px] pt-20 md:max-w-none md:gap-10 md:px-[120px] md:pb-[50px] md:pt-0"
      data-node-id="439:4905"
    >
      <PageHeader className="pb-2.5 md:pb-0" title="설정" />
      <UserProfileSummary />
      <div className="grid w-full grid-cols-1 gap-[22px] md:grid-cols-2 md:gap-x-5">
        <Section
          className="order-1 md:col-start-1 md:row-start-1"
          title="계정 관리"
        >
          <Link
            className="flex h-[57px] items-center justify-between rounded-[20px] bg-white p-5"
            href="/login"
          >
            <strong className="text-sm lg:text-base">로그아웃</strong>
            <Image
              alt=""
              width={18}
              height={18}
              src="/icons/settings/sign-out.svg"
            />
          </Link>
        </Section>
        <Section
          className="order-2 md:col-start-2 md:row-span-2 md:row-start-1"
          title="계획 관리"
        >
          <div className="flex flex-col gap-3">
            {plans.map((x) => (
              <Row key={x.label} {...x} />
            ))}
          </div>
        </Section>
        <Section
          className="order-3 md:col-start-1 md:row-start-2"
          title="계획･계정 정리"
        >
          <div className="flex flex-col gap-3">
            {cleanup.map((x) => (
              <Row key={x.label} {...x} />
            ))}
          </div>
        </Section>
      </div>
      <BottomTabBar activeTab="settings" />
    </PageContainer>
  );
}

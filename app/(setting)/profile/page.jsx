import Image from "next/image";
import Link from "next/link";
import { ForwardCaret } from "@/components/ForwardCaret";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { UserProfileSummary } from "@/components/UserProfileSummary";
import { BottomTabBar } from "@/components/BottomTabBar";

const planSettings = [
  { label: "계획 버전", value: "v2" },
  { label: "담당자 수락", href: "/role?person=jisu" },
  { label: "확인자 수락", href: "/role?person=jimin" },
  { label: "대기 이의제기", href: "/appeal" },
];

const cleanupSettings = [
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

function SettingsRow({ label, value, description, href }) {
  const content = (
    <>
      <span className={`flex min-w-0 flex-1 flex-col items-start ${description ? "gap-[7px]" : ""}`}>
        <strong className="text-sm leading-normal">{label}</strong>
        {description && <span className="whitespace-nowrap text-xs font-medium leading-normal text-[#838383]">{description}</span>}
      </span>
      {value && <span className="mr-2.5 text-xs font-medium text-[#838383]">{value}</span>}
      <ForwardCaret />
    </>
  );

  const className = `flex w-full items-center justify-between rounded-[20px] border-0 bg-white px-5 text-left ${description ? "min-h-[77px] py-[22px]" : "h-[57px] py-5"}`;

  if (href) {
    return <Link className={className} href={href}>{content}</Link>;
  }

  return <button className={className} type="button">{content}</button>;
}

function SettingsSection({ title, children }) {
  return (
    <section className="flex w-full flex-col gap-3.5">
      <h2 className="text-sm font-bold leading-normal">{title}</h2>
      {children}
    </section>
  );
}

export default function ProfileSettingsPage() {
  return (
    <PageContainer className="items-center gap-[22px] pb-[100px] pt-20" data-node-id="439:2037">
      <PageHeader className="pb-2.5" title="설정" />

      <UserProfileSummary />

      <SettingsSection title="계정 관리">
        <Link className="flex h-[57px] w-full items-center justify-between rounded-[20px] border-0 bg-white p-5 text-left" href="/login">
          <strong className="text-sm leading-normal">로그아웃</strong>
          <Image alt="" className="size-[18px]" height={18} src="/icons/settings/sign-out.svg" width={18} />
        </Link>
      </SettingsSection>

      <SettingsSection title="계획 관리">
        <div className="flex w-full flex-col gap-3">
          {planSettings.map((setting) => <SettingsRow key={setting.label} {...setting} />)}
        </div>
      </SettingsSection>

      <SettingsSection title="계획･계정 정리">
        <div className="flex w-full flex-col gap-3">
          {cleanupSettings.map((setting) => <SettingsRow key={setting.label} {...setting} />)}
        </div>
      </SettingsSection>
      <BottomTabBar activeTab="settings" />
    </PageContainer>
  );
}

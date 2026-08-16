import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { DesktopHeader } from "@/components/DesktopHeader";
import { AuthGuard } from "@/components/AuthGuard";

export default function ServiceInfoPage() {
  return (
    <AuthGuard>
      <main
        className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center justify-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e] md:max-w-none md:flex-col md:p-0"
        data-node-id="439:1154"
      >
      <DesktopHeader authenticated />
      <div className="flex w-full flex-1 items-center justify-center md:px-[140px] md:py-[50px]">
        <Card data-node-id="439:1155">
          <div className="flex flex-col items-center gap-3 whitespace-nowrap text-center">
            <h1 className="text-base font-bold">서비스 안내</h1>
            <div className="flex flex-col gap-1.5 text-sm font-medium text-[#838383]">
              <p>사망이 안전하게 확인되면,</p>
              <p>가족과 동료에게 필요한 일을</p>
              <p>올바른 순서로 이메일로 전달합니다.</p>
            </div>
          </div>

          <Button href="/restricted-info">확인</Button>
        </Card>
      </div>
      </main>
    </AuthGuard>
  );
}

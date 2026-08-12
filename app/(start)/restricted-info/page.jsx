import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function RestrictedInfoPage() {
  return (
    <main
      className="mx-auto flex min-h-dvh w-full max-w-[390px] items-center justify-center bg-[#f0f0f2] px-6 py-[70px] text-[#28292e]"
      data-node-id="439:1165"
    >
      <Card data-node-id="439:1166">
        <div className="flex flex-col items-center gap-3 whitespace-nowrap text-center">
          <h1 className="text-base font-bold">금지정보 안내</h1>
          <div className="flex flex-col gap-1.5 text-sm font-medium text-[#838383]">
            <p>비밀번호를 적지 마세요.</p>
            <p>계정 이름, 자료위치의 유형과</p>
            <p>원하는 처리 결과만 작성합니다.</p>
          </div>
        </div>

        <Button href="/agreement">
          확인
        </Button>
      </Card>
    </main>
  );
}

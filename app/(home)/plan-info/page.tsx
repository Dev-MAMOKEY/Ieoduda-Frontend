import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { PageContainer } from "@/components/PageContainer";

export default function PlanInfoPage() {
  return (
    <PageContainer
      className="items-center justify-center gap-5 py-[70px] md:!pb-[125px] md:!pt-0"
      data-node-id="513:3341"
    >
      <Card data-node-id="513:3342" variant="notice">
        <div className="flex flex-col items-center gap-3 whitespace-nowrap text-center">
          <h1 className="text-base font-bold">계획 작성 안내</h1>
          <div className="flex flex-col gap-1.5 text-sm font-medium text-[#838383]">
            <p>여기 적는 내용은 지금 실행되지 않아요.</p>
            <p>언제든 수정하거나 취소할 수 있어요.</p>
          </div>
        </div>

        <Button href="/verifier">새 계획 만들기</Button>
      </Card>

      <p className="w-full text-center text-[13px] font-medium text-[#838383]">
        실제 실행은 확인 절차를 모두 거친 뒤에 시작돼요
      </p>
    </PageContainer>
  );
}

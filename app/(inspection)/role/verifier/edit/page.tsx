import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

export default function EditVerifierPage() {
  return (
    <PageContainer
      className="gap-[22px] py-[70px] lg:max-w-none lg:gap-10 lg:px-[140px] lg:pb-[50px] lg:pt-0"
      data-node-id="522:2623"
    >
      <PageHeader
        backHref="/role?person=jimin"
        backLabel="역할별 패키지 미리보기로 돌아가기"
        className="pb-5 lg:pb-0"
        title="지정 확인자 수정"
      />
      <form className="flex w-full flex-col gap-[22px]">
        <h2 className="text-base font-bold lg:text-lg">지정 확인자</h2>
        <FormField
          autoComplete="name"
          id="verifier-name"
          label="확인자 이름"
          name="name"
          placeholder="이름을 입력해 주세요"
          type="text"
        />
        <FormField
          autoComplete="email"
          id="verifier-email"
          label="확인자 이메일"
          name="email"
          placeholder="이메일을 입력해 주세요"
          type="email"
        />
        <Button className="mt-[18px] lg:h-[52px]" href="/role?person=jimin">
          수정하기
        </Button>
      </form>
    </PageContainer>
  );
}

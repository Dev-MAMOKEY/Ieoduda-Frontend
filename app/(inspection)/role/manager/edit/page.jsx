import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

export default function EditRoleManagerPage() {
  return (
    <PageContainer className="gap-[22px] py-[70px]" data-node-id="513:845">
      <PageHeader
        backHref="/role"
        backLabel="역할별 패키지 미리보기로 돌아가기"
        className="pb-5"
        title="담당자 수정"
      />

      <h2 className="text-base font-bold">관계 정리 담당자</h2>

      <form className="flex w-full flex-col gap-[22px]">
        <FormField
          autoComplete="name"
          id="manager-name"
          label="담당자 이름"
          name="name"
          placeholder="이름을 입력해 주세요"
          type="text"
        />
        <FormField
          autoComplete="email"
          id="manager-email"
          label="담당자 이메일"
          name="email"
          placeholder="이메일을 입력해 주세요"
          type="email"
        />
        <Button href="/role">수정하기</Button>
      </form>
    </PageContainer>
  );
}

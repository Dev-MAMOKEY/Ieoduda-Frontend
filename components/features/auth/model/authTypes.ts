// 인증 폼에 표시할 입력 필드 한 개의 구조를 정의합니다.
export type AuthField = {
  id: string;
  label: string;
  type: "email" | "password";
  autoComplete: string;
  placeholder: string;
};

// 로그인과 회원가입 폼이 공통으로 받는 화면 설정을 정의합니다.
export type AuthFormProps = {
  variant: "login" | "signup";
  title: string;
  fields: readonly AuthField[];
  submitLabel: string;
  prompt: string;
  linkLabel: string;
  linkHref: string;
  submitHref?: string;
};

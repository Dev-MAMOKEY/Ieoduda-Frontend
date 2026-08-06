// 로그인과 회원가입 페이지의 중복 입력 정의와 화면 이동 설정을 한곳에서 관리합니다.
import type { AuthFormProps } from "./AuthForm";

const emailField = {
  id: "email",
  label: "이메일",
  type: "email",
  autoComplete: "email",
  placeholder: "이메일을 입력해주세요",
} as const;

const passwordPlaceholder = "비밀번호를 입력해주세요";

export const loginFormConfig = {
  variant: "login",
  title: "로그인",
  fields: [
    emailField,
    {
      id: "password",
      label: "비밀번호",
      type: "password",
      autoComplete: "current-password",
      placeholder: passwordPlaceholder,
    },
  ],
  submitLabel: "로그인하기",
  submitHref: "/service-description",
  prompt: "아직 회원이 아니신가요?",
  linkLabel: "회원가입하기",
  linkHref: "/signup",
} satisfies AuthFormProps;

export const signupFormConfig = {
  variant: "signup",
  title: "회원가입",
  fields: [
    emailField,
    {
      id: "password",
      label: "비밀번호",
      type: "password",
      autoComplete: "new-password",
      placeholder: passwordPlaceholder,
    },
    {
      id: "password-confirmation",
      label: "비밀번호 확인",
      type: "password",
      autoComplete: "new-password",
      placeholder: passwordPlaceholder,
    },
  ],
  submitLabel: "회원가입하기",
  prompt: "이미 계정이 있으신가요?",
  linkLabel: "로그인하기",
  linkHref: "/",
} satisfies AuthFormProps;

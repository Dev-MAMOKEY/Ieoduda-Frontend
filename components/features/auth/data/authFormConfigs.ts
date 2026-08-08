import type { AuthFormProps } from "../model/authTypes";

// 로그인과 회원가입에서 공통으로 사용하는 이메일 필드 설정입니다.
const emailField = {
  id: "email",
  label: "이메일",
  type: "email",
  autoComplete: "email",
  placeholder: "이메일을 입력해주세요",
} as const;

// 비밀번호 입력 필드에 공통으로 표시할 안내 문구입니다.
const passwordPlaceholder = "비밀번호를 입력해주세요";

// 공통 인증 폼을 로그인 화면으로 구성하는 데이터입니다.
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

// 공통 인증 폼을 회원가입 화면으로 구성하는 데이터입니다.
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

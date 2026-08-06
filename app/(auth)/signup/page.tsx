// 회원가입 입력 항목을 구성하고 로그인 화면으로 돌아가는 경로를 제공합니다.
import { AuthForm } from "@/components/features/auth/AuthForm";
import { signupFormConfig } from "@/components/features/auth/authFormConfigs";

export default function SignupPage() {
  return (
    <AuthForm {...signupFormConfig} />
  );
}

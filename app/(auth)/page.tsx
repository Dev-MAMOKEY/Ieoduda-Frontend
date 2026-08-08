// 루트 경로에서 로그인 폼을 구성하고 서비스 안내 화면으로 연결합니다.
import { AuthForm } from "@/components/features/auth/AuthForm";
import { loginFormConfig } from "@/components/features/auth/data/authFormConfigs";

// 로그인 설정을 공통 인증 폼에 전달해 로그인 화면을 구성합니다.
export default function LoginPage() {
  return (
    <AuthForm {...loginFormConfig} />
  );
}

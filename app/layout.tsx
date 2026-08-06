// 애플리케이션 전역 메타데이터와 모든 페이지가 공유하는 HTML 뼈대를 정의합니다.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "이어두다",
  description: "이어두다 로그인 및 회원가입",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

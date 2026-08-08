// 애플리케이션 전역 메타데이터와 모든 페이지가 공유하는 HTML 뼈대를 정의합니다.
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// 모든 페이지에 공통으로 적용되는 사이트 기본 메타데이터입니다.
export const metadata: Metadata = {
  title: "이어두다",
  description: "이어두다 로그인 및 회원가입",
};

// 루트 레이아웃이 감싸서 렌더링할 페이지 콘텐츠를 정의합니다.
type RootLayoutProps = {
  children: ReactNode;
};

// 전역 글꼴과 기본 HTML 구조를 적용하는 애플리케이션 최상위 레이아웃입니다.
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

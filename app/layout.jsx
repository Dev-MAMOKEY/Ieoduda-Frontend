import "./globals.css";

export const metadata = {
  title: "이어두다",
  description: "떠난 뒤에도, 남긴 것들이 이어지도록",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

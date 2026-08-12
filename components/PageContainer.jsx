export function PageContainer({ children, className = "", ...props }) {
  return (
    <main
      className={`mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-[#f0f0f2] px-6 text-[#28292e] ${className}`}
      {...props}
    >
      {children}
    </main>
  );
}

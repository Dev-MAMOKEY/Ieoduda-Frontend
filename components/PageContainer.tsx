import type { ComponentPropsWithoutRef, ReactNode } from "react";

type PageContainerProps = ComponentPropsWithoutRef<"main"> & { children: ReactNode };

export function PageContainer({ children, className = "", ...props }: PageContainerProps) {
  return (
    <main
      className={`mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-[#f0f0f2] px-6 text-[#28292e] ${className}`}
      {...props}
    >
      {children}
    </main>
  );
}

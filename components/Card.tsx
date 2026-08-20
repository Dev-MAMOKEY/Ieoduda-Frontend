import type { ComponentPropsWithoutRef, ReactNode } from "react";

const variants = {
  info: "justify-center gap-6 px-6 pb-[30px] pt-10",
  notice: "justify-center gap-8 px-6 pb-[34px] pt-11",
  agreement: "gap-[30px] px-[30px] pb-[30px] pt-10",
} as const;

type CardProps = ComponentPropsWithoutRef<"section"> & { children: ReactNode; variant?: keyof typeof variants };

export function Card({ children, variant = "info", className = "", ...props }: CardProps) {
  return (
    <section
      className={`flex w-full max-w-[340px] flex-col items-center overflow-hidden rounded-[30px] bg-white md:max-w-[460px] md:gap-10 md:px-10 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

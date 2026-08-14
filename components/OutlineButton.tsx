import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type OutlineButtonProps = { children: ReactNode; className?: string; href?: string } & Record<string, unknown>;

export function OutlineButton({ children, className = "", href = undefined, ...props }: OutlineButtonProps) {
  const classes = `flex h-[45px] w-full items-center justify-center gap-2 rounded-[20px] border-[1.6px] border-[#a8a8a8] px-5 text-[14px] font-normal leading-[normal] text-[#838383] transition-colors enabled:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383] disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  if (href) {
    return (
      <Link className={`${classes} hover:bg-white`} href={href} {...(props as Omit<ComponentPropsWithoutRef<typeof Link>, "href">)}>
        <span className="flex items-center justify-center gap-2 text-[14px] font-normal leading-[normal]">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ComponentPropsWithoutRef<"button">)}>
      <span className="flex items-center justify-center gap-2 text-[14px] font-normal leading-[normal]">
        {children}
      </span>
    </button>
  );
}

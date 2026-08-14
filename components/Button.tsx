import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const baseClassName =
  "flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-[14px] font-normal leading-[normal] text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383] md:rounded-[30px] md:text-[15px]";

type ButtonProps = { children: ReactNode; href?: string; className?: string } & Record<string, unknown>;

export function Button({ children, href = undefined, className = "", ...props }: ButtonProps) {
  const classes = `${baseClassName} ${href ? "hover:bg-[#929292]" : "enabled:hover:bg-[#929292] disabled:cursor-not-allowed disabled:opacity-60"} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
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

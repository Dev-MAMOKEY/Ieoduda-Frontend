import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

const baseClassName =
  "flex min-h-[44px] w-full items-center justify-center rounded-[14px] bg-[#3c2b62] px-5 py-[14px] text-sm font-medium leading-none text-[#fbfafd] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#43306d] md:min-h-[48px] md:text-base";

type ButtonProps = { children: ReactNode; href?: string; className?: string } & Record<string, unknown>;

export function Button({ children, href = undefined, className = "", ...props }: ButtonProps) {
  const classes = `${baseClassName} ${href ? "hover:bg-[#332452]" : "enabled:hover:bg-[#332452] disabled:cursor-not-allowed disabled:opacity-60"} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        <span className="flex items-center justify-center gap-2">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ComponentPropsWithoutRef<"button">)}>
      <span className="flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

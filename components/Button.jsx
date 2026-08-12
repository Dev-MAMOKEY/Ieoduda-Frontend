import Link from "next/link";

const baseClassName =
  "flex h-[45px] w-full items-center justify-center rounded-[20px] bg-[#a8a8a8] px-5 text-sm text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383]";

export function Button({ children, href, className = "", ...props }) {
  const classes = `${baseClassName} ${href ? "hover:bg-[#929292]" : "enabled:hover:bg-[#929292] disabled:cursor-not-allowed disabled:opacity-60"} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

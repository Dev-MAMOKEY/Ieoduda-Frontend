import { BackButton } from "@/components/BackButton";
import type { ReactNode } from "react";

type PageHeaderProps = { title: ReactNode; backHref?: string; backLabel?: string; history?: boolean; className?: string };

export function PageHeader({
  title,
  backHref = undefined,
  backLabel = undefined,
  history = false,
  className = "",
}: PageHeaderProps) {
  if (!backHref) {
    return (
      <header
        className={`flex w-full items-center justify-center ${className}`}
      >
        <h1 className="text-lg font-bold md:text-xl">{title}</h1>
      </header>
    );
  }

  return (
    <header
      className={`grid w-full grid-cols-[24px_1fr_24px] items-start ${className}`}
    >
      <BackButton history={history} href={backHref} label={backLabel} />
      <h1 className="text-center text-lg font-bold md:text-xl">{title}</h1>
      <span aria-hidden className="size-6" />
    </header>
  );
}

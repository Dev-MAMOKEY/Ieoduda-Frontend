import { BackButton } from "@/components/BackButton";

export function PageHeader({ title, backHref, backLabel, history = false, className = "" }) {
  if (!backHref) {
    return (
      <header className={`flex w-full items-center justify-center ${className}`}>
        <h1 className="text-lg font-bold md:text-xl">{title}</h1>
      </header>
    );
  }

  return (
    <header className={`grid w-full grid-cols-[24px_1fr_24px] items-start ${className}`}>
      <BackButton history={history} href={backHref} label={backLabel} />
      <h1 className="text-center text-lg font-bold md:text-xl">{title}</h1>
      <span aria-hidden className="size-6" />
    </header>
  );
}

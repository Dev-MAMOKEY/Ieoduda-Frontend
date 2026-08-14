"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function IeodudaPage() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIsLeaving(true), 1600);
    const navigationTimer = window.setTimeout(
      () => router.replace("/login"),
      2000,
    );

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(navigationTimer);
    };
  }, [router]);

  return (
    <main
      className={`mx-auto flex min-h-dvh w-full max-w-[390px] flex-col items-center overflow-hidden bg-[#f0f0f2] px-6 pt-[30.8dvh] text-[#28292e] transition-opacity duration-400 ease-out md:max-w-none md:p-0 ${isLeaving ? "opacity-0" : "opacity-100"}`}
      data-node-id="439:1222"
    >
      <section className="flex w-full flex-col items-center whitespace-nowrap leading-normal md:mt-[280px]">
        <p className="mb-[-14px] max-w-full text-[min(30vw,116px)] font-bold tracking-[-0.14em] text-[#d9d9d9] md:mb-[-10px] md:text-[180px] md:tracking-[-0.15em]">
          ieoduda
        </p>
        <p className="text-sm md:text-base">
          떠난 뒤에도, 남긴 것들이 이어지도록
        </p>
      </section>

      <p className="mt-[35.5dvh] text-sm font-medium md:mt-[260px] md:text-base">
        이어두다
      </p>
    </main>
  );
}

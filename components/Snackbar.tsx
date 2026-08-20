"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { consumeNavigationSnackbar, SNACKBAR_EVENT } from "@/lib/ui/snackbar";

const DISPLAY_DURATION = 3000;

export function Snackbar() {
  const pathname = usePathname();
  const [message, setMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const display = (nextMessage: string) => {
      if (!nextMessage) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(nextMessage);
      timerRef.current = setTimeout(() => setMessage(""), DISPLAY_DURATION);
    };
    const handleSnackbar = (event: Event) => display((event as CustomEvent<string>).detail);

    window.addEventListener(SNACKBAR_EVENT, handleSnackbar);
    display(consumeNavigationSnackbar());
    return () => {
      window.removeEventListener(SNACKBAR_EVENT, handleSnackbar);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!message) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-6 top-6 z-[150] flex justify-center md:bottom-8 md:top-auto"
      role="status"
    >
      <div className="max-w-[460px] rounded-[14px] bg-[#43306d] px-5 py-3.5 text-center text-sm font-medium leading-normal text-[#fbfafd] shadow-[0_8px_24px_rgba(67,48,109,0.24)] md:px-6 md:text-base">
        {message}
      </div>
    </div>
  );
}

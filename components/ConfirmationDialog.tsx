"use client";

import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";

export function ConfirmationDialog({
  cancelLabel = "취소하기",
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
}: {
  cancelLabel?: string;
  confirmLabel: string;
  description: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onCancel]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#28292e]/45 px-6 py-10" onMouseDown={onCancel}>
      <section
        aria-describedby="confirmation-description"
        aria-labelledby="confirmation-title"
        aria-modal="true"
        className="w-full max-w-[342px] rounded-[20px] bg-[#fbfafd] px-5 pb-5 pt-7 shadow-[0_18px_48px_rgba(40,41,46,0.22)] lg:max-w-[420px] lg:rounded-[24px] lg:px-7 lg:pb-7 lg:pt-8"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-[#e2dafa] text-xl font-bold text-[#43306d] lg:size-12">!</div>
          <h2 className="mt-5 text-lg font-bold text-[#43306d] lg:text-xl" id="confirmation-title">{title}</h2>
          <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#796b6c] lg:text-[15px]" id="confirmation-description">{description}</p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 lg:mt-8 lg:gap-4">
          <button autoFocus className="flex min-h-11 items-center justify-center rounded-[14px] bg-[#e2dafa] px-4 py-3.5 text-center text-sm font-medium leading-none text-[#43306d] transition-colors hover:bg-[#d6caef] lg:min-h-12 lg:text-base" onClick={onCancel} type="button">
            <span className="translate-y-px">{cancelLabel}</span>
          </button>
          <button className="flex min-h-11 items-center justify-center rounded-[14px] bg-[#43306d] px-4 py-3.5 text-center text-sm font-medium leading-none text-[#fbfafd] transition-colors hover:bg-[#332452] lg:min-h-12 lg:text-base" onClick={onConfirm} type="button">
            <span className="translate-y-px">{confirmLabel}</span>
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

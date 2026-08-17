import type { ComponentPropsWithoutRef, ReactNode } from "react";

type FormFieldProps = ComponentPropsWithoutRef<"input"> & {
  id: string;
  label: ReactNode;
  error?: string;
};

export function FormField({
  id,
  label,
  error,
  className = "",
  ...inputProps
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <label
        className="px-2.5 text-[16px] font-bold leading-none text-[#43306d]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`min-h-[48px] w-full rounded-[14px] border bg-[#fbfafd] px-5 py-4 text-[15px] font-medium leading-none text-[#584e4d] outline-none transition-colors placeholder:text-[#a99d9e] focus-visible:ring-2 ${
          error
            ? "border-red-500 focus-visible:ring-red-500/25"
            : "border-transparent focus-visible:ring-[#43306d]/25"
        }`}
        id={id}
        {...inputProps}
      />
      {error && (
        <p className="px-2.5 text-xs text-red-600" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

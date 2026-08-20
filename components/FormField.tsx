import type { ComponentPropsWithoutRef, ReactNode } from "react";

type FormFieldProps = ComponentPropsWithoutRef<"input"> & {
  id: string;
  label: ReactNode;
  error?: string;
  inputClassName?: string;
};

export function FormField({
  id,
  label,
  error,
  inputClassName = "",
  className = "",
  ...inputProps
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={`flex w-full flex-col gap-2.5 md:gap-2 ${className}`}>
      <label
        className="px-2.5 text-sm font-bold leading-none text-[#43306d] md:text-base"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`min-h-[44px] w-full rounded-[14px] border bg-[#fbfafd] px-4 py-[14px] text-[13px] font-medium leading-none text-[#584e4d] outline-none transition-colors placeholder:text-[#a99d9e] focus-visible:ring-2 md:min-h-[48px] md:px-5 md:py-4 md:text-[15px] ${
          error
            ? "border-red-500 focus-visible:ring-red-500/25"
            : "border-transparent focus-visible:ring-[#43306d]/25"
        } ${inputClassName}`}
        id={id}
        {...inputProps}
      />
      {error && (
        <p className="form-field-error px-2.5 text-xs text-red-600" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

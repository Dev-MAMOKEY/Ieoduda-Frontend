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
      <label className="px-2.5 text-sm font-semibold md:text-base" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={`h-[41px] w-full rounded-[20px] border bg-white px-5 text-sm outline-none transition-colors placeholder:text-[#a8a8a8] focus-visible:ring-2 md:h-[48px] md:rounded-[30px] md:text-base ${
          error
            ? "border-red-500 focus-visible:ring-red-500/25"
            : "border-transparent focus-visible:ring-[#a8a8a8]/50"
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

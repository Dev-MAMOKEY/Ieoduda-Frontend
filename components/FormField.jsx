export function FormField({ id, label, className = "", ...inputProps }) {
  return (
    <div className={`flex w-full flex-col gap-2.5 ${className}`}>
      <label className="px-2.5 text-sm font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        className="h-[45px] w-full rounded-[20px] border-0 bg-white px-5 text-sm outline-none placeholder:text-[#a8a8a8] focus-visible:ring-2 focus-visible:ring-[#a8a8a8]/50"
        id={id}
        {...inputProps}
      />
    </div>
  );
}

export function OutlineButton({ children, className = "", ...props }) {
  return (
    <button
      className={`flex h-[45px] w-full items-center justify-center gap-2 rounded-[20px] border-[1.6px] border-[#a8a8a8] px-5 text-sm text-[#838383] transition-colors enabled:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#838383] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const variants = {
  info: "justify-center gap-6 px-6 pb-[30px] pt-10",
  agreement: "gap-[26px] px-[30px] pb-[30px] pt-10",
};

export function Card({ children, variant = "info", className = "", ...props }) {
  return (
    <section
      className={`flex w-full max-w-[340px] flex-col items-center overflow-hidden rounded-[30px] bg-white ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

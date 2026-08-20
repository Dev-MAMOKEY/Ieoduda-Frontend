type ActionFeedbackProps = {
  children: string;
  tone?: "info" | "success" | "error";
};

const toneClassName = {
  info: "text-[#796b6c]",
  success: "text-[#43306d]",
  error: "text-red-600",
};

export function ActionFeedback({ children, tone = "info" }: ActionFeedbackProps) {
  return (
    <p
      aria-live="polite"
      className={`text-center text-sm font-medium leading-normal ${toneClassName[tone]}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}

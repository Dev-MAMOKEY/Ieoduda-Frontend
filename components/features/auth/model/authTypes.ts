export type AuthField = {
  id: string;
  label: string;
  type: "email" | "password";
  autoComplete: string;
  placeholder: string;
};

export type AuthFormProps = {
  variant: "login" | "signup";
  title: string;
  fields: readonly AuthField[];
  submitLabel: string;
  prompt: string;
  linkLabel: string;
  linkHref: string;
  submitHref?: string;
};

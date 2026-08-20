// 로그인 및 회원가입 폼의 클라이언트 입력값을 검증합니다.

export interface LoginValues {
  email: string;
  password: string;
}

export interface SignupValues extends LoginValues {
  name: string;
  passwordConfirm: string;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email) return "이메일을 입력해주세요.";
  if (!EMAIL_PATTERN.test(email)) return "올바른 이메일 형식을 입력해주세요.";
  return undefined;
}

export function validateLogin(values: LoginValues) {
  const errors: FieldErrors<LoginValues> = {};
  const emailError = validateEmail(values.email);

  if (emailError) errors.email = emailError;
  if (!values.password) errors.password = "비밀번호를 입력해주세요.";

  return errors;
}

export function validateSignup(values: SignupValues) {
  const errors: FieldErrors<SignupValues> = validateLogin(values);

  if (!values.name) errors.name = "이름을 입력해주세요.";
  if (!values.passwordConfirm) {
    errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
  } else if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  }

  return errors;
}

export function hasFieldErrors<T>(errors: FieldErrors<T>) {
  return Object.keys(errors).length > 0;
}

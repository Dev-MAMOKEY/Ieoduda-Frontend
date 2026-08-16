// Auth API에서 사용하는 요청, 응답 및 공통 오류 데이터의 타입을 정의합니다.

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiError | null;
  timestamp: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface SignupResponse {
  userId: number;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 화면에서 사용할 회원가입, 로그인, 인증 복구 및 로그아웃 기능을 제공합니다.

import axios from "axios";
import { apiClient, publicApiClient, refreshTokens } from "./client";
import type {
  ApiResponse,
  LoginRequest,
  SignupRequest,
  SignupResponse,
  TokenResponse,
} from "./auth-types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token-storage";
import { clearAllStoredConversationIds } from "./conversation-storage";

export async function signup(request: SignupRequest) {
  // 백엔드 회원가입 API에 검증된 이름, 이메일, 비밀번호 정보를 전달합니다.
  const { data } = await publicApiClient.post<ApiResponse<SignupResponse>>(
    "/auth/signup",
    request,
  );
  return data.data;
}

export async function login(request: LoginRequest) {
  // 로그인 성공 응답으로 받은 두 토큰을 Local Storage에 저장합니다.
  const { data } = await publicApiClient.post<ApiResponse<TokenResponse>>(
    "/auth/login",
    request,
  );
  setTokens(data.data.accessToken, data.data.refreshToken);
  return data.data;
}

export async function restoreAuthentication() {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  // 로그인 유지의 기준인 Refresh Token이 없으면 남아 있는 인증 정보도 삭제합니다.
  if (!refreshToken) {
    clearTokens();
    return false;
  }

  // 두 토큰이 모두 있으면 현재 로그인 상태를 그대로 사용합니다.
  if (accessToken) return true;

  // Access Token은 없고 Refresh Token만 있으면 토큰을 재발급해 로그인 상태를 복구합니다.
  try {
    await refreshTokens();
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

export async function logout() {
  try {
    // Access Token으로 사용자를 식별해 서버에 저장된 Refresh Token을 무효화합니다.
    if (getAccessToken()) {
      await apiClient.post("/auth/logout");
    }
  } finally {
    // 서버 로그아웃 성공 여부와 관계없이 브라우저의 인증 및 대화 세션 정보를 제거합니다.
    clearTokens();
    clearAllStoredConversationIds();
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.error?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

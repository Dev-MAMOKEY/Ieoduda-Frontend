// 공통 Axios 설정과 인증 헤더 첨부, 401 응답 시 토큰 재발급을 처리합니다.

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse, TokenResponse } from "./auth-types";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./token-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 토큰 발급이 다시 가능해지면 true로 변경해 401 로그인 이동을 활성화합니다.
const AUTH_REDIRECT_ENABLED = false;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.");
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 이메일 링크로 접근하는 공개 API 전용 클라이언트입니다.
// 저장된 로그인 토큰을 첨부하거나 401 응답에서 토큰 재발급을 시도하지 않습니다.
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 토큰 재발급 요청이 응답 인터셉터를 다시 거치지 않도록 별도 Axios 인스턴스를 사용합니다.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise: Promise<string> | null = null;

// 저장된 Refresh Token으로 새 Access Token과 Refresh Token을 발급받아 교체합니다.
// 여러 API가 동시에 401을 반환해도 진행 중인 재발급 요청을 함께 사용합니다.
export async function refreshTokens() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("저장된 리프레시 토큰이 없습니다.");
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiResponse<TokenResponse>>("/auth/refresh", { refreshToken })
      .then(({ data }) => {
        if (!data.success || !data.data) {
          throw new Error(data.error?.message ?? "토큰 재발급에 실패했습니다.");
        }

        setTokens(data.data.accessToken, data.data.refreshToken);
        return data.data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  // 모든 API 요청 직전에 저장된 Access Token을 Authorization 헤더에 첨부합니다.
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    const isAuthRequest = request?.url?.startsWith("/auth/");

    // 401이 아니거나 이미 재시도한 요청이면 재발급을 반복하지 않습니다.
    // 로그인, 회원가입, 재발급 등의 Auth 요청도 자동 재발급 대상에서 제외합니다.
    if (error.response?.status !== 401 || !request || request._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      const accessToken = await refreshTokens();
      request.headers.Authorization = `Bearer ${accessToken}`;

      // 새 Access Token으로 401이 발생했던 기존 요청을 한 번 다시 전송합니다.
      return apiClient(request);
    } catch (refreshError) {
      // 재발급에 실패하면 로그인 정보를 제거하고 로그인 화면으로 이동합니다.
      clearTokens();

      if (AUTH_REDIRECT_ENABLED && typeof window !== "undefined") {
        window.location.replace("/login");
      }

      return Promise.reject(refreshError);
    }
  },
);

// Access Token과 Refresh Token을 브라우저 Local Storage에서 관리합니다.

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function getStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function getAccessToken() {
  return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function getRefreshToken() {
  return getStorage()?.getItem(REFRESH_TOKEN_KEY) ?? null;
}

export function setTokens(accessToken: string, refreshToken: string) {
  // 로그인과 토큰 재발급 시 받은 두 토큰을 함께 저장합니다.
  const storage = getStorage();
  storage?.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage?.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  // 로그아웃 또는 토큰 재발급 실패 시 저장된 인증 정보를 모두 삭제합니다.
  const storage = getStorage();
  storage?.removeItem(ACCESS_TOKEN_KEY);
  storage?.removeItem(REFRESH_TOKEN_KEY);
}

export function hasStoredTokens() {
  return Boolean(getAccessToken() || getRefreshToken());
}

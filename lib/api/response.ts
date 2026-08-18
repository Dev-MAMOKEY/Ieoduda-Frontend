import type { ApiResponse } from "./auth-types";

export function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data == null) {
    throw new Error(response.error?.message ?? "요청을 처리하지 못했습니다.");
  }
  return response.data;
}

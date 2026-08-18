import { apiClient } from "./client";
import type { ApiResponse } from "./auth-types";
import type { UserResponse, UserUpdateRequest } from "./user-types";
import { unwrap } from "./response";

export async function getCurrentUser() {
  const { data } = await apiClient.get<ApiResponse<UserResponse>>("/users/me");
  return unwrap(data);
}

export async function updateCurrentUser(request: UserUpdateRequest) {
  const { data } = await apiClient.put<ApiResponse<UserResponse>>("/users/me", request);
  return unwrap(data);
}

export async function deleteCurrentUser() {
  await apiClient.delete("/users/me");
}

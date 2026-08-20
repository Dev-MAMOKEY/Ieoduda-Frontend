export interface UserResponse {
  userId: string;
  email: string;
  name: string;
}

export interface UserUpdateRequest {
  email: string;
  name: string;
}

import apiClient from "./apiClient";

// 1. Register
export const registerUser = (payload) =>
  apiClient.post("/api/auth/register", payload).then((res) => res.data);

// 2. Verify Email OTP
export const verifyEmailOtp = (payload) =>
  apiClient.post("/api/auth/verify-email", payload).then((res) => res.data);

// 3. Login
export const loginUser = (payload) =>
  apiClient.post("/api/auth/login", payload).then((res) => res.data);

// 4. Refresh Token
export const refreshTokenApi = (payload) =>
  apiClient.post("/api/auth/refresh-token", payload).then((res) => res.data);

// 5. Logout
export const logoutApi = () =>
  apiClient.post("/api/auth/logout").then((res) => res.data);

// 6. Forgot Password
export const forgotPasswordApi = (payload) =>
  apiClient.post("/api/auth/forgot-password", payload).then((res) => res.data);

// 7. Reset Password
export const resetPasswordApi = (payload) =>
  apiClient.post("/api/auth/reset-password", payload).then((res) => res.data);

// Me permissions
export const getMyPermissions = () =>
  apiClient.get("/api/auth/me/permissions").then((res) => res.data);

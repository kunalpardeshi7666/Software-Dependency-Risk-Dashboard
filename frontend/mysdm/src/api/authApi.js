import { api } from "./axiosInstance";

// ✅ Backend Routes: /api/auth/...


export const authApi = {
   login: (payload) => api.post("/auth/login", payload),
  
// ✅ TEMP disable this because backend endpoint missing
  myPermissions: () => Promise.resolve({ data: [] }),
  refreshToken: (refreshToken) =>
    api.post("/auth/refresh-token", { refreshToken }),

  logout: () => api.post("/auth/logout"),

  // ✅ Permissions
  // myPermissions: () => api.get("/auth/me/permissions"),

  // ✅ Register + OTP
  register: (payload) => api.post("/auth/register", payload),
  verifyEmail: (payload) => api.post("/auth/verify-email", payload),

  forgotPassword: (payload) => api.post("/auth/forgot-password", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),

  changePassword: (payload) => api.post("/auth/change-password", payload),

  // ✅ Admin Only
  getUsers: () => api.get("/auth/users"),
  assignRole: (payload) => api.post("/auth/assign-role", payload),
  lockUser: (payload) => api.post("/auth/lock-user", payload),

  registerAdmin: (payload) => api.post("/auth/register-admin", payload),
};


// import { api } from "./axiosInstance";

// export type LoginRequest = {
//   email: string;
//   password: string;
// };

// export type LoginResponse = {
//   accessToken: string;
//   refreshToken: string;
//   role: string;
//   expiresIn?: number;
// };

// export const authApi = {
//   login: (payload: LoginRequest) =>
//     api.post<LoginResponse>("/auth/login", payload),

//   refreshToken: (refreshToken: string) =>
//     api.post<LoginResponse>("/auth/refresh-token", { refreshToken }),

//   logout: () => api.post("/auth/logout"),

//   mePermissions: () => api.get<string[]>("/auth/me/permissions"),

//   register: (payload: any) => api.post("/auth/register", payload),

//   registerAdmin: (payload: any) => api.post("/auth/register-admin", payload),

//   verifyEmail: (payload: any) => api.post("/auth/verify-email", payload),

//   forgotPassword: (payload: any) => api.post("/auth/forgot-password", payload),

//   resetPassword: (payload: any) => api.post("/auth/reset-password", payload),

//   changePassword: (payload: any) => api.post("/auth/change-password", payload),

//   // ✅ Admin Only
//   users: () => api.get("/auth/users"),
//   assignRole: (payload: { userId: string; role: string }) =>
//     api.post("/auth/assign-role", payload),

//   lockUser: (payload: { userId: string; lock: boolean }) =>
//     api.post("/auth/lock-user", payload),
// };

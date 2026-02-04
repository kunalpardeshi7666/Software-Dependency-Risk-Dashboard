import {api} from "./axiosInstance";

export const teamApi = {
  list: () => api.get("/team"),
  getById: (id) => api.get(`/team/${id}`),
  create: (data) => api.post("/team", data),
//   update: (id, data) => api.put(`/team/${id}`, data),
  updateProfile: (id, data) => api.put(`/team/${id}/profile`, data),

  remove: (id) => api.delete(`/team/${id}`),
  resetPassword: (id, data) => api.post(`/team/${id}/reset-password`, data),
changePassword: (id, data) => api.post(`/team/${id}/change-password`, data),

};

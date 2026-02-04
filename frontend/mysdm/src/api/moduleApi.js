import { api } from "./axiosInstance";

export const moduleApi = {
  listByProject: (projectId) => api.get(`/modules/project/${projectId}`),
  create: (payload) => api.post("/modules", payload),
  update: (id, payload) => api.put(`/modules/${id}`, payload),
  remove: (id) => api.delete(`/modules/${id}`),
  // update: (id, payload) => axiosInstance.put(`/modules/${id}`, payload),


};

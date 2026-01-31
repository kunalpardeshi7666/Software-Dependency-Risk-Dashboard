import { api } from "./axiosInstance";

export const taskApi = {
  listByModule: (moduleId) => api.get(`/tasks/module/${moduleId}`),
  create: (payload) => api.post("/tasks", payload),
  remove: (id) => api.delete(`/tasks/${id}`),
};

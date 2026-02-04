import { api } from "./axiosInstance";

export const projectTeamApi = {
  listAssigned: (projectId) => api.get(`/projects/${projectId}/team`),
  assign: (projectId, payload) => api.post(`/projects/${projectId}/team`, payload),
  remove: (projectId, userId) =>
    api.delete(`/projects/${projectId}/team/${userId}`),
};

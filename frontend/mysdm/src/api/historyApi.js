import { api } from "./axiosInstance";

export const historyApi = {
  list: () => api.get("/dependencies/history"),

  details: (runId) => api.get(`/dependencies/history/${runId}`),

  // ✅ Admin only delete
  deleteRun: (runId) => api.delete(`/dependencies/history/${runId}`),
};

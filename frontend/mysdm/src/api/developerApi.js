import {api} from "./axiosInstance";




export const developerApi = {
  getAll: () => api.get("/Developers"),
   list: () => api.get("/Developers"),
  create: (data) => api.post("/Developers", data),
  update: (id, data) => api.put(`/Developers/${id}`, data),
  remove: (id) => api.delete(`/Developers/${id}`),
};


// returns: [{ projectName: string, taskCount: number }]
// getTasksPerProject: () => api.get("/dashboard/tasks-per-project"),


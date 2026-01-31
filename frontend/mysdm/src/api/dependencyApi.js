// import axiosInstance from "./axiosInstance";

// export const dependencyApi = {
//   // Legacy module endpoints
//   listAll: () => axiosInstance.get("/dependencies"),

//   listByProject: (projectId) =>
//     axiosInstance.get(`/dependencies/project/${projectId}`),

//   create: (payload) => axiosInstance.post("/dependencies", payload),

//   remove: (id) => axiosInstance.delete(`/dependencies/${id}`),

//   // Dependency graph
//   graph: (projectId) =>
//     axiosInstance.get(`/dependency-graph/${projectId}`),
// };
import { api } from "./axiosInstance";

export const dependencyApi = {
  listAll: () => api.get("/dependencies"),
  listByProject: (projectId) => api.get(`/dependencies/project/${projectId}`),

  create: (payload) => api.post("/dependencies", payload),
  remove: (id) => api.delete(`/dependencies/${id}`),

  // ✅ Graph
  graph: (projectId) => api.get(`/dependency-graph/${projectId}`),
};

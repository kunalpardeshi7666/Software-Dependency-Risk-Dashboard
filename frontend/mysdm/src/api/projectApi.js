import { api } from "./axiosInstance";

// ✅ Backend Routes: /api/projects
export const projectApi = {
   list: () => api.get("/projects"),
   getById: (id) => api.get(`/projects/${id}`),

  create: (payload) => api.post("/projects", payload),
  update: (id, payload) => api.put(`/projects/${id}`, payload),

  changeStatus: (id, payload) => api.patch(`/projects/${id}/status`, payload),
  remove: (id) => api.delete(`/projects/${id}`),

  // ✅ Members
  members: (projectId) => api.get(`/projects/${projectId}/members`),
  addMember: (projectId, payload) =>
    api.post(`/projects/${projectId}/members`, payload),

  updateMemberRole: (projectId, userId, payload) =>
    api.put(`/projects/${projectId}/members/${userId}/role`, payload),

  removeMember: (projectId, userId) =>
    api.delete(`/projects/${projectId}/members/${userId}`),

  // ✅ Audit
  audit: (projectId) => api.get(`/projects/${projectId}/audit`),

  // ✅ Summary Dashboard
  summary: () => api.get("/projects/dashboard/summary"),

  // ✅ Access Visibility
  getAccess: (projectId) => api.get(`/projects/${projectId}/access`),
  updateAccess: (projectId, visibility) =>
    api.put(`/projects/${projectId}/access`, visibility),
};






// import { api } from "./axiosInstance";

// export const projectApi = {
//   list: () => api.get("/projects"),
//   create: (payload) => api.post("/projects", payload),
//   update: (id, payload) => api.put(`/projects/${id}`, payload),
//   changeStatus: (id, payload) => api.patch(`/projects/${id}/status`, payload),
//   remove: (id) => api.delete(`/projects/${id}`),

//   members: (projectId) => api.get(`/projects/${projectId}/members`),
//   addMember: (projectId, payload) => api.post(`/projects/${projectId}/members`, payload),
//   updateMemberRole: (projectId, userId, payload) =>
//     api.put(`/projects/${projectId}/members/${userId}/role`, payload),
//   removeMember: (projectId, userId) =>
//     api.delete(`/projects/${projectId}/members/${userId}`),

//   audit: (projectId) => api.get(`/projects/${projectId}/audit`),
// };

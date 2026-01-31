// import axiosInstance from "./axiosInstance";

// export const scanApi = {
//   // Backend: POST /api/dependency-scans
//   createScan: (payload) =>
//     axiosInstance.post("/dependency-scans", payload),

//   // Backend: GET /api/dependency-scans/project/{projectId}
//   listProjectScans: (projectId) =>
//     axiosInstance.get(`/dependency-scans/project/${projectId}`),

//   // Backend: GET /api/dependency-scans/{scanRunId}
//   getDetails: (scanRunId) =>
//     axiosInstance.get(`/dependency-scans/${scanRunId}`),

//   // Optional
//   outdated: (scanRunId) =>
//     axiosInstance.get(`/dependency-scans/${scanRunId}/outdated`),

//   vulnerabilities: (scanRunId) =>
//     axiosInstance.get(`/dependency-scans/${scanRunId}/vulnerabilities`),
// };
import { api } from "./axiosInstance";

export const scanApi = {
  createScan: (payload) => api.post("/dependency-scans", payload),

  listProjectScans: (projectId) =>
    api.get(`/dependency-scans/project/${projectId}`),

  getDetails: (scanRunId) => api.get(`/dependency-scans/${scanRunId}`),

  outdated: (scanRunId) =>
    api.get(`/dependency-scans/${scanRunId}/outdated`),

  vulnerabilities: (scanRunId) =>
    api.get(`/dependency-scans/${scanRunId}/vulnerabilities`),

  graph: (scanRunId) => api.get(`/dependency-scans/${scanRunId}/graph`),
};

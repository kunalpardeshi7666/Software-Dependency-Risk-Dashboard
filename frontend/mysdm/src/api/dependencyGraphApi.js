import {api} from "./axiosInstance";

export const getDependencyGraph = async (projectId, type = "reactflow") => {
  const res = await api.get(`/api/dependency-graph/${projectId}?type=${type}`);
  return res.data;
};

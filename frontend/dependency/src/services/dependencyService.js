import api from "./api";

export const getDependencies = () => api.get("/dependencies");

export const getRiskSummary = () => api.get("/risk/summary");

export const scanDependencies = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/scan/file", form);
  return data;
};

export const scanGithubRepo = async (repoUrl) => {
  const { data } = await api.post("/scan/github", { repoUrl });
  return data;
};

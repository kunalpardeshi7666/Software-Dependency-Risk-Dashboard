import axios from "axios";


const api = axios.create({
   baseURL: "http://localhost:21453/", //  backend URL
  // baseURL: "https://localhost:7012", // change port
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

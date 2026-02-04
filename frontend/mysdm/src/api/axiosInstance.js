import axios from "axios";

// // const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:19249/api" ||"http://localhost:19249/api";



// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:19249/api";

// export const api = axios.create({ baseURL: API_BASE });


// // ✅ Attach Access Token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ✅ Refresh Token Logic
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
//   failedQueue = [];
// };
// console.log("API_BASE:", API_BASE);

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const original = err.config;
//     const status = err?.response?.status;

//     // ✅ if unauthorized -> refresh
//     if (status === 401 && !original._retry) {
//       original._retry = true;

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           original.headers.Authorization = `Bearer ${token}`;
//           return api(original);
//         });
//       }

//       isRefreshing = true;

//       try {
//         const refreshToken = localStorage.getItem("refreshToken");
//         if (!refreshToken) throw new Error("No refresh token");

//         const res = await axios.post(`${API_BASE}/auth/refresh-token`, {
//           refreshToken,
//         });

//         const newAccess = res.data.accessToken;
//         const newRefresh = res.data.refreshToken;

//         localStorage.setItem("accessToken", newAccess);
//         localStorage.setItem("refreshToken", newRefresh);

//         processQueue(null, newAccess);

//         original.headers.Authorization = `Bearer ${newAccess}`;
//         return api(original);
//       } catch (refreshErr) {
//         processQueue(refreshErr, null);
//         localStorage.clear();
//         window.location.href = "/login";
//         return Promise.reject(refreshErr);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(err);
//   }
// );



// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE||"http://localhost:19249/api";




// export const api = axios.create({ baseURL: API_BASE });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export const api = axios.create({
  baseURL: "http://localhost:19249/api",
});

// ✅ Automatically attach token in every request
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token"); // ✅ must match your saved key
     const token = localStorage.getItem("accessToken");

    // localStorage.setItem("accessToken", authResponse.accessToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// import axios from "axios";

// export const api = axios.create({
//   baseURL: "https://localhost:5001/api",
//   headers: {
//     "Content-Type": "application/json"
//   }
// });
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default api;
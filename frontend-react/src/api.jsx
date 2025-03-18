import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use((config) => {
//   const currentLocal = window.location.pathname;
//   console.log(currentLocal);
//   const token = document.cookie
//     .split(";")
//     .filter((it) => it.startsWith("token"))
//     .at(0)
//     .split("=")
//     .at(1);
//   if (!token) {
//     localStorage.removeItem("userData");
//     if (currentLocal !== "/login") {
//       window.location.href = "/login";
//     }
//   }
//   return config;
// });

export default api;
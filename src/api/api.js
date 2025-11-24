/* import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
}); */

// attach Authorization automatically (we'll set token into localStorage)
/* API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

export default API;
 */

// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/", // Your Django backend URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // JWT token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;


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

import axios from "axios";

// Fallback to localhost if environment variable is missing
/* const BASE_URL =
  typeof process !== "undefined" && process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL
    : "http://localhost:8000/"; */

const BASE_URL = "http://localhost:8000/authentication";


const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Automatically attach Authorization token from localStorage
API.interceptors.request.use((config) => {
  const access = localStorage.getItem("access_token");
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

export default API;

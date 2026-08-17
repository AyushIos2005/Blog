import axios from "axios";

// In dev, requests go to a relative path ("") and Vite's proxy (see
// vite.config.js) forwards them to the backend. This keeps the browser on a
// single origin (localhost:5173) so the backend's SameSite=Strict auth
// cookie is actually sent back on every request — a cross-port request
// (5173 -> 3000) counts as cross-site and Strict cookies are dropped there,
// even with CORS allowed.
//
// In production, set VITE_API_BASE_URL to your deployed API's full origin.
export const API_BASE_URL = "https://blog-pd6p.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;

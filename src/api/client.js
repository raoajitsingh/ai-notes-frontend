// client.js-->frontend

import axios from "axios";

const API_BASE = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export default api;

import axios from "axios";

const client = axios.create({
  // empty fallback, same-origin deploys
  baseURL: import.meta.env.VITE_API_URL || "",
});

client.interceptors.request.use((config) => {
  // attach auth once here so call sites focus on payloads & params
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;

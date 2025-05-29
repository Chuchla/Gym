// src/api/axiosInstance.jsx
import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api/";

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// interceptor request – dopisze nagłówek Authorization, jeśli mamy token
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (
      token &&
      !config.url.includes("register") &&
      !config.url.includes("login") &&
      !config.url.includes("articles")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default AxiosInstance;

// src/api/axiosInstance.jsx
import axios from "axios";
import { logout } from "../Utils/Auth.jsx";

const baseUrl = "http://127.0.0.1:8000/api/";

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

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

AxiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(`${baseUrl}token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;

          localStorage.setItem("accessToken", access);

          AxiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${access}`;
          originalRequest.headers["Authorization"] = `Bearer ${access}`;

          return AxiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token is invalid or expired", refreshError);
          logout();
          return Promise.reject(refreshError);
        }
      } else {
        console.log("No refresh token available, logging out.");
        logout();
      }
    }

    return Promise.reject(error);
  },
);

export default AxiosInstance;

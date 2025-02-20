import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

// Axios Request Interceptor to add userId to headers or body
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log(parsedUser)
      if (parsedUser?._id) {
        // Add userId to the request headers
        config.headers["userId"] = parsedUser._id; // Use "userId" in headers
        // Alternatively, to send it in the request body, uncomment the next line:
        // if (config.data) config.data.userId = parsedUser._id;  // Add userId to body
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;

    // Handle Unauthorized (401) response
    if (data === "Unauthorized" && status === 401) {
      window.location.href = "/"; // Redirect to login page if Unauthorized
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;


import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Create an axios instance using the baseURL from the .env file
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Access baseURL from .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the token from cookies if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get("token"); // Assuming your token is stored as 'token' in cookies

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors and show toast for other errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Show a toast for any error that occurs
    if (error.response) {
      // Show a toast with the error message from the response
      toast.error(
        `Error: ${error.response.data.error || "Something went wrong"}`
      );
    } else {
      // Handle the case where there is no response (e.g., network error)
      toast.error("Network error. Please try again later.");
    }

    // Handle 401 error: remove token from cookies and redirect to login page
    if (error.response && error.response.status === 401) {
      Cookies.remove("token"); // Remove token from cookies
      window.location.href = "/login"; // Redirect to login page
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

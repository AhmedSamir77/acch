// src/auth.js
import axiosInstance from "../plugins/axios";
import Cookies from "js-cookie";

export const login = (username, password) => {
  return new Promise((resolve, reject) => {
    // Make the login request to the backend
    axiosInstance
      .post("/auth/login", { username, password })
      .then((response) => {
        // Check if the response contains a token
        if (response.data.token) {
          // Store the token in cookies
          const expirationTime = new Date(
            new Date().getTime() + 8 * 60 * 60 * 1000
          ); // 8 hours in milliseconds

          Cookies.set("token", response.data.token, {
            expires: expirationTime,
          }); // Token will expire in 7 days (you can adjust this)

          Cookies.set("username", username, {
            expires: expirationTime,
          }); // Token will expire in 7 days (you can adjust this)

          // Resolve the promise with loggedin as true
          resolve({ loggedin: true });
        } else {
          // If no token in the response, resolve as loggedin false
          resolve({ loggedin: false });
        }
      })
      .catch((error) => {
        // If there's an error (e.g., 401), resolve with loggedin false
        console.error("Login error:", error);
        resolve({ loggedin: false });
      });
  });
};

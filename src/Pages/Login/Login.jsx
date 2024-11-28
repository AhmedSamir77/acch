import React, { useState, useEffect } from "react";
import "./Login.module.css";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { Box, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { DNA } from "react-loader-spinner";
import loginImg from "../../assets/images/slide-w-overlay.jpg";
import loginImg2 from "../../assets/images/WhatsApp-Image-2024-05-14-at-10.32.18-AM.jpeg";
import alexicon from "./../../assets/images/alexcont-icon.png";
import { login } from "../../services/auth";

export default function Login() {
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [imageSwap, setImageSwap] = useState(false); // State to toggle between images

  let formik = useFormik({
    initialValues: {
      Username: "",
      password: "",
    },
    onSubmit: submitLoginForm,
  });

  let navigate = useNavigate();

  async function submitLoginForm(values) {
    setLoader(true); // Start loader before checking credentials

    const { Username, password } = values;

    console.log("Submitted values:", values); // Debugging: Check what values are being passed

    const { loggedin } = await login(Username, password);
    if (loggedin) {
      navigate("/users");
    }
    setLoader(false); // Stop loader after the process
  }

  // Auto swap images every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setImageSwap((prev) => !prev); // Toggle image swap state
    }, 2000); // Swap every 2 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row", // Ensure image and form are aligned horizontally
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f8ff", // Light background color for the page
          padding: 0,
        }}
      >
        {/* Title with Glassy Effect */}
        <Box
          sx={{
            position: "absolute",
            top: "20px",
            textAlign: "center",
            width: "100%",
            padding: "30px 0",
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.3)",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              color: "transparent",
              backgroundImage:
                "linear-gradient(45deg, #00B4D8, #0077B6, #00B5D7)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              textTransform: "uppercase",
              letterSpacing: "5px",
              textShadow:
                "2px 2px 5px rgba(0, 0, 0, 0.3), 0px 0px 25px rgba(255, 255, 255, 0.5)",
              animation:
                "fadeIn 2s ease-in-out, textGlow 1.5s infinite alternate",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Alexandria Container & Cargo Handling Company
          </Typography>

          {/* Subtitle and Image next to the quote */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15px",
              gap: "10px", // Adds space between the quote and the image
            }}
          >
            {/* Image */}
            <img
              src={alexicon}
              alt="Alexicon Logo"
              style={{
                width: "150px", // Adjust the size as needed
                height: "auto",
                marginLeft: "10px", // Adds slight space between the quote and the image
              }}
            />

            {/* Quote */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "300",
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.0rem" }, // Adjusted font size for smaller screens
                color: "#555",
                fontStyle: "italic",
                textAlign: "center",
                letterSpacing: "1px", // Reduced letter spacing for better readability
                maxWidth: "600px", // Ensures the text doesn't stretch too wide
                opacity: 0.8,
                lineHeight: 1.5, // Controls the spacing between lines
                display: "-webkit-box", // Allows multi-line truncation
                overflow: "hidden", // Hides any overflowed text
                WebkitBoxOrient: "vertical", // Enables the box to be vertical
                WebkitLineClamp: 2, // Limits the text to two lines
              }}
            >
              "Our Vision To Become The First Preferred Choice For All Our
              Customers In The Field Of Container And Cargo Handling Locally And
              Regionally."
            </Typography>
          </Box>
        </Box>

        {/* Left Side: Image */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 3,
            transform: "translateY(160px)", // Shift the box to the left slightly
          }}
        >
          <img
            src={imageSwap ? loginImg2 : loginImg} // Toggle between images
            alt="Login Illustration"
            style={{
              width: "80%",
              maxWidth: "500px",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.5s ease, opacity 0.5s ease",
              opacity: imageSwap ? 0.8 : 1,
              transform: imageSwap ? "scale(1.1)" : "scale(1)",
            }}
          />
        </Box>

        {/* Right Side: Login Form with UI Enhancements */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "450px",
            padding: 5,
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "translateY(160px) translateX(-200px)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: "400",
              marginBottom: 3,
              color: "#333",
              textAlign: "center",
              textShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
              letterSpacing: "1.5px",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              // fontFamily: "'Great Vibes', cursive", // Elegant French-style cursive font
              textTransform: "none",
              backgroundImage: "linear-gradient(45deg, #6a11cb, #2575fc)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              padding: "0 10px",
              animation: "fadeIn 1.5s ease-out",
            }}
          >
            Login
          </Typography>

          <form
            action=""
            onSubmit={formik.handleSubmit}
            style={{ width: "100%" }}
          >
            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              name="Username"
              variant="outlined"
              value={formik.values.Username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{
                marginBottom: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                "&:hover .MuiOutlinedInput-root": {
                  borderColor: "#00B4D8",
                },
              }}
              required
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              sx={{
                marginBottom: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                "&:hover .MuiOutlinedInput-root": {
                  borderColor: "#00B4D8",
                },
              }}
              required
            />

            {/* Error Message */}
            {error && (
              <div
                style={{
                  color: "#e74c3c",
                  fontSize: "14px",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                padding: "12px 0",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: "#5e72e4",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#3f50b5",
                },
              }}
              disabled={!formik.isValid || loader}
            >
              {loader ? (
                <DNA
                  visible={true}
                  height="25"
                  width="49.5"
                  ariaLabel="dna-loading"
                  wrapperStyle={{}}
                  wrapperClass="dna-wrapper"
                />
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}

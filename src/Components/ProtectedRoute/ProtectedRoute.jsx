import React from "react";
import "./ProtectedRoute.module.css";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute(props) {
  if (Cookies.get("token")) {
    return props.children;
  } else {
    return <Navigate to={"/login"} />;
  }
}

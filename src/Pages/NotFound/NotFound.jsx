import React from "react";
import "./NotFound.module.css";
import notfound from "./../../assets/images/error-404c.jpg";
import SideBar from "../../Components/SideBar/SideBar";

export default function NotFound() {
  return (
    <>
    
      <img src={notfound} className="errorimg ps-5 w-100" alt="" />
    </>
  );
}

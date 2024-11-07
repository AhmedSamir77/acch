import React from "react";
import "./NotFound.module.css";
import notfound from "./../../assets/images/error.svg";
import SideBar from "../../Components/SideBar/SideBar";

export default function NotFound() {
  return (
    <>
    <SideBar/>
      <img src={notfound} className=" ms-5 ps-5 w-75" alt="" />
    </>
  );
}

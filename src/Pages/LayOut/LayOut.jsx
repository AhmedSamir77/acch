import React from "react";
import "./LayOut.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import SideBar from "../../Components/SideBar/SideBar";

export default function LayOut() {
  return (
    <>
     
      
      <Outlet></Outlet>
      <Footer />
    </>
  );
}

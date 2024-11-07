import React from "react";
import "./Navbar.module.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { pink } from "@mui/material/colors";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function Navbar() {
  let navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const userToken = Cookies.get("userToken");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function logOut() {
    Cookies.remove("userToken");

    navigate("/login");
    window.location.reload();
  }

  return (
    <AppBar position="fixed" color="info" sx={{ zIndex: 9999 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        

          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "black",
              textDecoration: "none",
            }}
          >
            Arkan Company
          </Typography>
          <Box
            style={{ justifyContent: "center" }}
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            <Typography class="fonty" variant="h4" color="black">
             Alexandria Containers 🚢
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {userToken && (
              <span
                className="log nav-link "
                onClick={() => {
                  logOut();
                }}
              >
                LogOut
              </span>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

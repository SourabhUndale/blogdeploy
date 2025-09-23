import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function Layout() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <Outlet key={location.pathname} />
      <Footer />
    </>
  );
}

export default Layout;

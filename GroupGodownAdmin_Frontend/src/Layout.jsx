import React, { useEffect } from "react";
import SideBar from "./components/navbar/SideBar";
import { isValidToken, redirectToLogin } from './utils/auth';

function Layout() {
  useEffect(() => {
    if (!isValidToken()) {
      redirectToLogin();
    }
  }, []);

  return (
    <>
      <SideBar />
    </>
  );
}

export default Layout;

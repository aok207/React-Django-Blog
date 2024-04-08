import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestRoutes = ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  if (userInfo) {
    return <Navigate to="/" />;
  }

  return children;
};

export default GuestRoutes;

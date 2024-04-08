import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    auth();
  }, []);

  const refreshToken = async (refreshToken: string) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_BASE_URL + "/api/token/refresh/",
        {
          refresh: refreshToken,
        }
      );

      if (res.status === 200) {
        localStorage.setItem("access", res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token!);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration && tokenExpiration < now) {
      const refreshTokenValue = localStorage.getItem("refresh");

      console.log(token);

      if (!refreshTokenValue) {
        setIsAuthorized(false);
        return;
      }

      refreshToken(refreshTokenValue);
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <Loader loading={true} override={{}} size={50} color="purple" />;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

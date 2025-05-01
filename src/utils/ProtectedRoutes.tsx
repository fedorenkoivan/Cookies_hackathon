import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  }, []);

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/sign-up"/>;
};

export default ProtectedRoutes;
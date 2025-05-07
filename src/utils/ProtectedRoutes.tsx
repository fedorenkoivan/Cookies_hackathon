import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Downloading...</div>;
  }

  if (isAuthenticated === true) {
    return <Outlet />;
  }

  return <Navigate to="/sign-up" />;
};

export default ProtectedRoutes;
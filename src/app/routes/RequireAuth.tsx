import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSession } from "@/features/auth/hooks/useSession";

export default function RequireAuth() {
  const { user, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return null;
  }
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

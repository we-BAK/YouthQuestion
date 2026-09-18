import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routePaths";
import AccessDenied from "../pages/Admin/AccessDenied";
import { Loader2 } from "lucide-react";
import EthiopianCross from "../components/ui/EthiopianCross";

export default function PermissionRoute({ permission, permissions, children }) {
  const { user, loading, hasPermission, hasAnyPermission } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="relative flex items-center justify-center">
          <EthiopianCross size={48} variant="gold" className="animate-pulse opacity-60" />
          <Loader2 className="absolute h-14 w-14 animate-spin text-amber-600" />
        </div>
        <p className="text-sm font-medium text-slate-600 font-serif-eotc">
          ፈቃድ በማረጋገጥ ላይ... (Verifying permissions...)
        </p>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <AccessDenied requiredPermission={permission} />;
  }

  // Check array of permissions (user must have at least one)
  if (permissions && permissions.length > 0 && !hasAnyPermission(permissions)) {
    return <AccessDenied requiredPermission={permissions.join(" / ")} />;
  }

  return children ? children : <Outlet />;
}

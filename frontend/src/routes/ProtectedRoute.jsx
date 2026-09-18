import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "./routePaths";
import { Loader2 } from "lucide-react";
import EthiopianCross from "../components/ui/EthiopianCross";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0a0f1d] text-slate-100">
        <div className="relative flex items-center justify-center">
          <EthiopianCross size={48} variant="gold" className="animate-pulse opacity-60" />
          <Loader2 className="absolute h-14 w-14 animate-spin text-amber-500" />
        </div>
        <p className="text-sm font-medium text-amber-200/80 font-serif-eotc">
          የተጠቃሚ መረጃ በማረጋገጥ ላይ...
        </p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
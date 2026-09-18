import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../routes/routePaths";
import EthiopianCross from "../../components/ui/EthiopianCross";

export default function AccessDenied({ requiredPermission }) {
  const navigate = useNavigate();
  const { role, profile, user } = useAuth();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      {/* Container Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-900/20 bg-white p-8 shadow-xl">
        {/* Subtle decorative cross watermark */}
        <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
          <EthiopianCross size={100} variant="gold" />
        </div>

        {/* Shield Icon Badge */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 shadow-inner">
          <ShieldAlert className="h-10 w-10 text-amber-700" />
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200 mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>403 • የመዳረሻ ፈቃድ የለም (Access Restricted)</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif-eotc text-2xl font-bold text-slate-900">
          ይህንን ገጽ የመመልከት ፈቃድ የለዎትም
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          You do not have the required permissions assigned to your role to access this section or perform this action.
        </p>

        {/* User Context Info Box */}
        <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Logged in User:</span>
            <span className="font-semibold text-slate-800">
              {profile?.full_name || user?.email || "Unknown"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Assigned Role:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
              {role?.name || profile?.role || "No Role"}
            </span>
          </div>

          {requiredPermission && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Required Permission:</span>
              <code className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {requiredPermission}
              </code>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>ወደ ዳሽቦርድ ተመለስ (Back to Dashboard)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

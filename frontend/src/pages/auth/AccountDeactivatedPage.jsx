import {
  ShieldX,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AccountDeactivatedPage() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-8 text-center">

          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
            <ShieldX
              size={32}
              className="text-rose-600"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-slate-900">
            Account Deactivated
          </h1>

          {/* Message */}
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your account has been deactivated by an
            administrator.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You no longer have access to the EOTC
            Youth Ministry management portal.
          </p>

          {/* Notice */}
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-left">
            <p className="text-sm font-medium text-rose-800">
              Need access again?
            </p>

            <p className="mt-1 text-xs leading-5 text-rose-700">
              Please contact a system administrator
              if you believe your account was
              deactivated by mistake.
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <LogOut size={16} />
            Sign Out
          </button>

        </div>
      </div>
    </div>
  );
}
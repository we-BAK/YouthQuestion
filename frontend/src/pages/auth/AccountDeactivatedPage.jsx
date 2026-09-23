import {
  ShieldX,
  Mail,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AccountDeactivatedPage() {
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-10 text-center">

          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
            <ShieldX
              size={40}
              className="text-rose-600"
            />
          </div>

          {/* Title */}
          <h1 className="mt-6 text-2xl font-semibold text-slate-900">
            Account Deactivated
          </h1>

          {/* Message */}
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your account has been deactivated by
            the system administrator.
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You currently do not have access to the
            EOTC Youth Ministry portal.
          </p>

          {/* Contact Admin */}
          <div className="mt-7 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <Mail size={18} />

              <span className="text-sm font-semibold">
                Contact the Administrator
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-amber-700">
              Please contact the system administrator
              if you believe your account should be
              reactivated.
            </p>
          </div>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <LogOut size={17} />
            Sign Out
          </button>

        </div>
      </div>
    </main>
  );
}
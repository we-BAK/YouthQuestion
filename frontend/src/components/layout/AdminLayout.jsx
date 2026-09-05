import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/routePaths";

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white flex flex-col justify-between">
        <div>
          <div className="border-b p-6 text-xl font-bold text-orange-600">
            Phoenix Framework
          </div>

          <nav className="space-y-1 p-4">
            <NavLink
              to={ROUTES.USERS}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              User Management
            </NavLink>

            <NavLink
              to={ROUTES.QUESTIONS}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              Questions Review
            </NavLink>

            <NavLink
              to={ROUTES.SETTINGS}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              Settings
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">
          <h1 className="font-semibold text-slate-800">Admin Portal</h1>
          <span className="text-sm text-slate-500">Administrator</span>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
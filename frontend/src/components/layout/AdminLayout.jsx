import { Outlet, useNavigate } from "react-router-dom";
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
      <aside className="fixed inset-y-0 left-0 w-64 bg-white">
        <div className="border-b p-6 text-xl font-bold text-orange-600">
          Phoenix Framework
        </div>

        <nav className="space-y-2 p-4">
          <a
            href="/admin/users"
            className="block rounded-lg bg-orange-50 px-4 py-3 text-sm font-medium text-orange-600"
          >
            User Management
          </a>
        </nav>
      </aside>

      <div className="pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">
          <h1 className="font-semibold text-slate-800">Admin Portal</h1>
          <span className="text-sm text-slate-500">Administrator</span>
        </header>

        <main className="p-8">
          <Outlet />
        </main>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { createUser, getUsers, getActiveUsers } from "../../Services/userService";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active'
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Reviewer",
    status: "Active",
  });

  async function loadUsers(filterActive = false) {
    try {
      setLoading(true);
      setError("");

      const fetchFn = filterActive ? getActiveUsers : getUsers;
      const registeredUsers = await fetchFn();
      setUsers(registeredUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers(activeTab === "active");
  }, [activeTab]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");

      await createUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        status: form.status,
      });

      await loadUsers(activeTab === "active");
      setShowRegisterForm(false);
      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "Reviewer",
        status: "Active",
      });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-600">Administration</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage authorized users and their spiritual question review permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRegisterForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition"
        >
          + Register User
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Users
        </button>
        <button
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "active"
              ? "border-orange-600 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Users
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Loading system users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No users found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id || user.email} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div>{user.name || "N/A"}</div>
                    <div className="text-xs text-slate-400 font-normal">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === "Active" || user.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {user.created ? new Date(user.created).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Register User Modal Dialog */}
      {showRegisterForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-bold text-slate-900">
                Register New User
              </h2>

              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="text-2xl text-slate-400 hover:text-slate-700 leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. John Doe"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm({ ...form, fullName: event.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="name@sundayschool.org"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <input
                  required
                  minLength={8}
                  type="password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">System Role</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={form.role}
                    onChange={(event) =>
                      setForm({ ...form, role: event.target.value })
                    }
                  >
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Reviewer</option>
                    <option>Program Coordinator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Account Status</label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 text-sm rounded-lg shadow-sm transition"
              >
                Register User
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
import { useEffect, useState } from "react";
import { createUser, getUsers, getActiveUsers } from "../../Services/userService";
import EthiopianCross from "../../components/ui/EthiopianCross";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Plus,
  Mail,
  Lock,
  User,
  X,
  CheckCircle2,
} from "lucide-react";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [saving, setSaving] = useState(false);
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
      setUsers(registeredUsers || []);
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
      setSaving(true);
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
    } finally {
      setSaving(false);
    }
  }

  const activeCount = users.filter((u) => u.status === "Active" || u.is_active).length;
  const reviewerCount = users.filter((u) => u.role === "Reviewer").length;

  return (
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
              አስተዳዳሪዎችና አገልጋዮች • Clergy & Reviewers
            </span>
          </div>
          <h1 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
            User & Clergy Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage authorized clergy members, youth coordinators, and question reviewers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRegisterForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-amber-900/20 border border-amber-500/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Clergy / User</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Authorized Users
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-serif-eotc">
                {users.length}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Clergy / Reviewers
              </p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1 font-serif-eotc">
                {activeCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Spiritual Reviewers
              </p>
              <h3 className="text-2xl font-bold text-amber-700 mt-1 font-serif-eotc">
                {reviewerCount}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "all"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Users ({users.length})
        </button>
        <button
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === "active"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Clergy & Reviewers ({activeCount})
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        {loading ? (
          <div className="p-16 text-center flex flex-col items-center space-y-3">
            <EthiopianCross size={36} variant="gold" className="animate-spin" />
            <p className="text-slate-500 text-sm">Loading authorized users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No users registered in this view.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3.5">User / Clergy Member</th>
                <th className="px-6 py-3.5">Ministry Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id || user.email} className="hover:bg-amber-50/20 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {(user.name || user.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.name || "N/A"}</div>
                        <div className="text-xs text-slate-400 font-normal">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === "Active" || user.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-7 shadow-2xl border border-amber-500/20"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <EthiopianCross size={26} variant="gold" />
                <h3 className="text-lg font-bold text-slate-900 font-serif-eotc">
                  Register Clergy or Reviewer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Dn. Yohannes Tesfaye"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="email"
                    placeholder="reviewer@eotc-youth.org"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ministry Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Reviewer">Question Reviewer</option>
                    <option value="Admin">System Administrator</option>
                    <option value="Clergy">Priest / Spiritual Advisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                {saving ? "Registering..." : "Register User"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
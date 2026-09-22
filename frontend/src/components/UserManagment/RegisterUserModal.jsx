import {
  Mail,
  Lock,
  User,
  X,
} from "lucide-react";

import EthiopianCross from "../ui/EthiopianCross";

export default function RegisterUserModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  roles,
  rolesLoading,
  saving,
}) {
  if (!open) {
    return null;
  }

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">

      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg space-y-4 rounded-3xl bg-white p-7 shadow-2xl border border-amber-500/20"
      >

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">

          <div className="flex items-center gap-2">

            <EthiopianCross
              size={26}
              variant="gold"
            />

            <h3 className="text-lg font-bold text-slate-900 font-serif-eotc">
              Register Clergy or Reviewer
            </h3>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* Form */}
        <div className="space-y-3">

          {/* Full name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>

            <div className="relative">

              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                required
                type="text"
                placeholder="e.g. Dn. Yohannes Tesfaye"
                value={form.fullName}
                onChange={(e) =>
                  updateField("fullName", e.target.value)
                }
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />

            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>

            <div className="relative">

              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                required
                type="email"
                placeholder="reviewer@example.com"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />

            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>

            <div className="relative">

              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) =>
                  updateField("password", e.target.value)
                }
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />

            </div>
          </div>

          {/* Role + Status */}
          <div className="grid grid-cols-2 gap-3">

            {/* Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ministry Role
              </label>

              <select
                required
                value={form.role}
                disabled={
                  rolesLoading ||
                  roles.length === 0
                }
                onChange={(e) =>
                  updateField("role", e.target.value)
                }
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              >

                {rolesLoading && (
                  <option value="">
                    Loading roles...
                  </option>
                )}

                {!rolesLoading &&
                  roles.length === 0 && (
                    <option value="">
                      No roles available
                    </option>
                  )}

                {!rolesLoading &&
                  roles.length > 0 && (
                    <>
                      <option value="">
                        Select a role
                      </option>

                      {roles.map((role) => (
                        <option
                          key={role.id}
                          value={role.code}
                        >
                          {role.name}
                        </option>
                      ))}
                    </>
                  )}

              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Initial Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value
                  )
                }
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              rolesLoading ||
              roles.length === 0 ||
              !form.role
            }
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            {saving
              ? "Registering..."
              : "Register User"}
          </button>

        </div>

      </form>

    </div>
  );
}
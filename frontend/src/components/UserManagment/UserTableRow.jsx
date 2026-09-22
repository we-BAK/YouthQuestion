export default function UserTableRow({ user }) {
  const isActive = user.status === "Active";

  return (
    <tr className="hover:bg-amber-50/20 transition">

      {/* User */}
      <td className="px-6 py-4 font-medium text-slate-900">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {(user.full_name || "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <div className="font-semibold text-slate-900">
              {user.full_name || "N/A"}
            </div>

            

          </div>

        </div>

      </td>

      {/* Role */}
      <td className="px-6 py-4">

        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
          {formatRole(user.role)}
        </span>

      </td>

      {/* Status */}
      <td className="px-6 py-4">

        {isActive ? (
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

      {/* Registration Date */}
      <td className="px-6 py-4 text-xs text-slate-500">
        {user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "—"}
      </td>

    </tr>
  );
}

function formatRole(role) {
  if (!role) return "N/A";

  const roleNames = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    REVIEWER: "Reviewer",
    PROGRAM_COORDINATOR: "Program Coordinator",
  };

  return roleNames[role] || role;
}
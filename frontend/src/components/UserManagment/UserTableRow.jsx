import {
  UserRound,
  UserCheck,
  UserX,
} from "lucide-react";

export default function UserTableRow({
  user,
  onStatusChange,
  statusUpdating,
}) {
  const isActive = user.status === "Active";

  const displayName =
    user.name ||
    user.full_name ||
    "Unknown User";

  const roleName =
    user.role_name ||
    user.role ||
    "User";

  const registrationDate =
    user.created ||
    user.created_at;

  function formatDate(date) {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  }

  function getInitials(name) {
    if (!name) {
      return "?";
    }

    const parts = name
      .trim()
      .split(/\s+/);

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  function formatRole(role) {
    if (!role) {
      return "User";
    }

    const roleMap = {
      SUPER_ADMIN: "Super Admin",
      ADMIN: "Admin",
      REVIEWER: "Reviewer",
      PROGRAM_COORDINATOR:
        "Program Coordinator",
    };

    return (
      roleMap[role] ||
      role
        .toLowerCase()
        .split("_")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ")
    );
  }

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      {/* ==========================================
          USER
          ========================================== */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {getInitials(displayName)}
          </div>

          <div className="min-w-0">
            <p className="font-medium text-slate-900 truncate">
              {displayName}
            </p>

            {user.email && (
              <p className="text-xs text-slate-400 truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* ==========================================
          MINISTRY ROLE
          ========================================== */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          {formatRole(roleName)}
        </span>
      </td>

      {/* ==========================================
          STATUS
          ========================================== */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            isActive
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-100 text-slate-600"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive
                ? "bg-emerald-500"
                : "bg-slate-400"
            }`}
          />

          {isActive
            ? "Active"
            : "Inactive"}
        </span>
      </td>

      {/* ==========================================
          REGISTRATION DATE
          ========================================== */}
      <td className="px-6 py-4 text-slate-500">
        {formatDate(registrationDate)}
      </td>

      {/* ==========================================
          ACTIONS
          ========================================== */}
      <td className="px-6 py-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              onStatusChange(user)
            }
            disabled={
              statusUpdating ||
              !onStatusChange
            }
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive
                ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            {isActive ? (
              <>
                <UserX size={14} />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck size={14} />
                Activate
              </>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
import EthiopianCross from "../ui/EthiopianCross";
import UserTableRow from "./UserTableRow";

export default function UserTable({
  users,
  loading,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-sm">

      {loading ? (
        <div className="p-16 text-center flex flex-col items-center space-y-3">

          <EthiopianCross
            size={36}
            variant="gold"
            className="animate-spin"
          />

          <p className="text-slate-500 text-sm">
            Loading authorized users...
          </p>

        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          No users registered in this view.
        </div>
      ) : (
        <table className="w-full text-left text-sm text-slate-600 border-collapse">

          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-xs tracking-wider">
            <tr>

              <th className="px-6 py-3.5">
                User / Clergy Member
              </th>

              <th className="px-6 py-3.5">
                Ministry Role
              </th>

              <th className="px-6 py-3.5">
                Status
              </th>

              <th className="px-6 py-3.5">
                Registration Date
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
              />
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}
import {
  Users,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

export default function UserStats({
  totalUsers,
  activeUsers,
  reviewers,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <StatCard
        title="Total Authorized Users"
        value={totalUsers}
        icon={Users}
        iconClass="bg-amber-50 text-amber-700 border-amber-200"
      />

      <StatCard
        title="Active Clergy / Reviewers"
        value={activeUsers}
        valueClass="text-emerald-700"
        icon={UserCheck}
        iconClass="bg-emerald-50 text-emerald-700 border-emerald-200"
      />

      <StatCard
        title="Spiritual Reviewers"
        value={reviewers}
        valueClass="text-amber-700"
        icon={ShieldCheck}
        iconClass="bg-rose-50 text-rose-800 border-rose-200"
      />

    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>

          <h3
            className={`text-2xl font-bold mt-1 font-serif-eotc ${valueClass}`}
          >
            {value}
          </h3>
        </div>

        <div className={`p-3 rounded-xl border ${iconClass}`}>
          <Icon className="w-6 h-6" />
        </div>

      </div>

    </div>
  );
}
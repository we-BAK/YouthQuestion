import { Plus } from "lucide-react";

// import EthiopianCross from "../../../components/ui/EthiopianCross";
import Can from "../auth/Can";

export default function UserPageHeader({ onRegister }) {
  return (
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
          Manage authorized clergy members, youth coordinators,
          and question reviewers.
        </p>
      </div>

      <Can permission="USERS_CREATE">
        <button
          type="button"
          onClick={onRegister}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-amber-900/20 border border-amber-500/30 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />

          <span>
            + Register Clergy / User
          </span>
        </button>
      </Can>

    </div>
  );
}
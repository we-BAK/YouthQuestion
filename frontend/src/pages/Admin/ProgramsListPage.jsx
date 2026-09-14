import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import EthiopianCross from "../../components/ui/EthiopianCross";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Hourglass,
  HelpCircle,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function ProgramsListPage() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/programs");
      if (!res.ok) throw new Error("Failed to load spiritual programs");
      const data = await res.json();
      setPrograms(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const code = p.status?.code || "PLANNING";
      const matchesStatus =
        statusFilter === "ALL" || code.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [programs, searchQuery, statusFilter]);

  // Aggregate stats
  const totalQuestionsSum = programs.reduce((acc, p) => acc + (p.totalQuestions || 0), 0);
  const scheduledCount = programs.filter(
    (p) => (p.status?.code || "").toUpperCase() === "SCHEDULED"
  ).length;
  const completedCount = programs.filter(
    (p) => (p.status?.code || "").toUpperCase() === "COMPLETED"
  ).length;

  const getStatusBadgeStyle = (code) => {
    switch (code) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20";
      case "SCHEDULED":
        return "bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/20";
      case "PLANNED":
      case "PLANNING":
        return "bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-400/20";
      case "CANCELLED":
        return "bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400/20";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
              መርሐ-ግብራት • Schedules
            </span>
          </div>
          <h1 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
            Programs & Spiritual Gatherings
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Overview of scheduled youth discussion sessions, spiritual topics, and question outcomes.
          </p>
        </div>

        <Link
          to={ROUTES.PROGRAM_CREATE}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-amber-900/20 border border-amber-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Program</span>
        </Link>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Gatherings
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-serif-eotc">
                {programs.length}
              </h3>
              <p className="text-[11px] text-amber-700 font-medium mt-1">
                {completedCount} completed sessions
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Upcoming & Scheduled
              </p>
              <h3 className="text-2xl font-bold text-amber-700 mt-1 font-serif-eotc">
                {scheduledCount}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Active youth sessions
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-900/10 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assigned Questions
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1 font-serif-eotc">
                {totalQuestionsSum}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Submitted by youth community
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs by title or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          {["ALL", "SCHEDULED", "COMPLETED", "PLANNING"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Cards Grid */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-24 bg-white border border-amber-900/10 rounded-2xl space-y-3">
          <EthiopianCross size={42} variant="gold" className="animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Loading scheduled programs and liturgical agendas...
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm">
          {error}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-16 bg-white border border-amber-900/10 rounded-2xl p-8 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-amber-50 border border-amber-200">
            <EthiopianCross size={40} variant="gold" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 font-serif-eotc">
            No spiritual programs found
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? "No programs match your search criteria. Try clearing the filter."
              : "Create the first spiritual gathering to organize youth questions and assigned clergy."}
          </p>
          <Link
            to={ROUTES.PROGRAM_CREATE}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Program</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrograms.map((program) => {
            const { totalQuestions = 0, outcomeCounts = {} } = program;
            const status = program.status || {};
            const addressed = outcomeCounts.ADDRESSED || 0;
            const partial = outcomeCounts.PARTIALLY_ADDRESSED || 0;
            const progressPercent =
              totalQuestions > 0 ? Math.round(((addressed + partial * 0.5) / totalQuestions) * 100) : 0;

            return (
              <div
                key={program.id}
                onClick={() => navigate(`/admin/programs/${program.id}`)}
                className="group relative bg-white border border-slate-200/90 hover:border-amber-400 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top accent ribbon on card */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-700 to-amber-600 opacity-80" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-md">
                      {program.reference_number || "PRG-REF"}
                    </span>
                    <span
                      className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle(
                        status.code
                      )}`}
                    >
                      {status.name || "PLANNED"}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-serif-eotc leading-snug">
                    {program.title}
                  </h2>

                  {program.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                      <span className="font-medium text-slate-700">
                        {new Date(program.program_date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {(program.start_time || program.end_time) && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>
                          {program.start_time || "TBD"} – {program.end_time || "TBD"}
                        </span>
                      </div>
                    )}

                    {program.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                        <span className="truncate">{program.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Progress & Action Bar */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">
                      Questions ({totalQuestions})
                    </span>
                    <span className="text-[11px] font-bold text-amber-700">
                      {progressPercent}% discussed
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${
                          totalQuestions > 0 ? (addressed / totalQuestions) * 100 : 0
                        }%`,
                      }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                    />
                    <div
                      style={{
                        width: `${
                          totalQuestions > 0 ? (partial / totalQuestions) * 100 : 0
                        }%`,
                      }}
                      className="bg-amber-400 h-full transition-all duration-500"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex gap-3 text-[11px] font-medium">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {addressed} Addressed
                      </span>
                      <span className="text-amber-700 flex items-center gap-1">
                        <Hourglass className="w-3 h-3" /> {partial} Partial
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-xs group-hover:translate-x-1 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
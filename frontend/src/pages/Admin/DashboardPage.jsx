import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/routePaths";
import { fetchQuestions } from "../../Services/questionService";
import { getUsers } from "../../Services/userService";
import { getCategories } from "../../Services/categoryService";
import EthiopianCross from "../../components/ui/EthiopianCross";
import Can from "../../components/auth/Can";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.access_token || ""}`,
  };
}
import {
  LayoutDashboard,
  HelpCircle,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Tag,
  AlertCircle,
  ShieldCheck,
  Plus,
  Radio,
  FileText,
  MapPin,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError(null);

      const headers = await getAuthHeaders();

      const [questionsData, programsRes, categoriesData, usersData] =
        await Promise.all([
          fetchQuestions().catch(() => []),
          fetch(`${API_URL}/api/programs`, { headers })
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []),
          getCategories().catch(() => []),
          getUsers().catch(() => []),
        ]);

      setQuestions(questionsData || []);
      setPrograms(programsRes || []);
      setCategories(categoriesData || []);
      setUsers(usersData || []);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Key metrics calculation
  const totalQuestions = questions.length;
  const uncategorizedQuestions = questions.filter(
    (q) => !q.categories || q.categories.length === 0
  );
  const categorizedQuestions = questions.filter(
    (q) => q.categories && q.categories.length > 0
  );

  // Upcoming programs (sorted by date, only future or scheduled)
  const today = new Date().toISOString().split("T")[0];
  const upcomingPrograms = programs
    .filter((p) => {
      const code = (p.status?.code || "").toUpperCase();
      return code === "SCHEDULED" || code === "PLANNING" || p.program_date >= today;
    })
    .sort((a, b) => new Date(a.program_date) - new Date(b.program_date));

  // Recent 5 questions
  const recentQuestions = [...questions].slice(0, 5);

  // Category distribution
  const categoryCounts = categories.map((cat) => {
    const count = questions.filter((q) =>
      q.categories?.some((c) => String(c.id) === String(cat.id))
    ).length;
    return {
      ...cat,
      count,
      percent: totalQuestions > 0 ? Math.round((count / totalQuestions) * 100) : 0,
    };
  });

  const activeClergyCount = users.filter(
    (u) => u.status === "Active" || u.is_active
  ).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <EthiopianCross size={48} variant="gold" className="animate-spin" />
        <p className="text-sm font-medium text-slate-500 font-serif-eotc">
          Loading spiritual dashboard & ministry reports...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Executive Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#090d16] border border-slate-800/80 p-5 sm:p-7 text-white shadow-xs">
        {/* Subtle Watermark */}
        <div className="absolute right-4 -bottom-10 opacity-[0.04] pointer-events-none select-none">
          <EthiopianCross size={260} variant="white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-amber-300 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Ministry Overview • አጠቃላይ እይታ</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif-eotc">
              ሰላም ለእናንተ ይሁን
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Track youth inquiries, organize upcoming church discussion sessions, and assign theological topics to clergy reviewers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Can permission="PROGRAMS_CREATE">
              <Link
                to={ROUTES.PROGRAM_CREATE}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Program</span>
              </Link>
            </Can>

            <Can permission="QUESTIONS_VIEW">
              <Link
                to={ROUTES.QUESTIONS}
                className="inline-flex items-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium px-3.5 py-2 rounded-lg border border-white/[0.08] transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Review Questions</span>
              </Link>
            </Can>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* ── 4 Executive KPI Cards (Stripe / Linear Style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Total Inquiries
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {totalQuestions}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span>{categorizedQuestions.length} categorized</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">
                  {totalQuestions > 0
                    ? Math.round((categorizedQuestions.length / totalQuestions) * 100)
                    : 0}
                  % organized
                </span>
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.QUESTIONS}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600 hover:text-amber-700 flex items-center justify-between transition-colors"
          >
            <span>View All Questions</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Uncategorized Questions */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Needs Topic</span>
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {uncategorizedQuestions.length}
              </h3>
              <p className="text-xs text-rose-600 mt-1">
                Inquiries awaiting topic classification
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.QUESTIONS}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-rose-700 hover:text-rose-800 flex items-center justify-between transition-colors"
          >
            <span>Assign Categories</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
          </Link>
        </div>

        {/* Upcoming Programs */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Upcoming Sessions
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {upcomingPrograms.length}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Scheduled gatherings & workshops
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.PROGRAMS}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600 hover:text-blue-700 flex items-center justify-between transition-colors"
          >
            <span>Manage Schedule</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        {/* Active Clergy & Reviewers */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Active Clergy
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {activeClergyCount}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Authorized reviewers & coordinators
              </p>
            </div>
          </div>
          <Link
            to={ROUTES.USERS}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-600 hover:text-emerald-700 flex items-center justify-between transition-colors"
          >
            <span>View Directory</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* ── Two-Column Main Content Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Programs Spotlight + Recent Questions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Programs Spotlight */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif-eotc text-lg font-bold text-slate-900">
                    Upcoming Spiritual Programs (የሚቀጥሉ መርሐ-ግብራት)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Next gatherings, assigned youth questions, and liturgical venues.
                  </p>
                </div>
              </div>
              <Link
                to={ROUTES.PROGRAMS}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingPrograms.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <p className="text-xs text-slate-400">No upcoming programs scheduled yet.</p>
                <Link
                  to={ROUTES.PROGRAM_CREATE}
                  className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Gathering</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {upcomingPrograms.slice(0, 3).map((prog) => (
                  <div
                    key={prog.id}
                    onClick={() => navigate(`/admin/programs/${prog.id}`)}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-amber-50/30 hover:border-amber-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                          {prog.reference_number || "PRG-REF"}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {prog.status?.name || "SCHEDULED"}
                        </span>
                      </div>
                      <h4 className="font-serif-eotc font-bold text-slate-900 text-sm">
                        {prog.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-700" />
                          {new Date(prog.program_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {prog.location && (
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <MapPin className="w-3.5 h-3.5 text-rose-600" />
                            {prog.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <div className="text-right text-xs">
                        <span className="block font-bold text-slate-900">
                          {prog.totalQuestions || 0} Questions
                        </span>
                        <span className="text-[11px] text-slate-500">Assigned</span>
                      </div>
                      <span className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 group-hover:text-amber-700">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Youth Questions Feed */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif-eotc text-lg font-bold text-slate-900">
                    Latest Youth Inquiries (የቅርብ ጊዜ ጥያቄዎች)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Recently received questions from bot subscribers and youth members.
                  </p>
                </div>
              </div>
              <Link
                to={ROUTES.QUESTIONS}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
              >
                <span>Review All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentQuestions.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No submitted questions in database.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentQuestions.map((q) => {
                  const isUncategorized = !q.categories || q.categories.length === 0;

                  return (
                    <div
                      key={q.id}
                      className="py-3.5 flex items-start justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded">
                            {q.referenceNumber || "REF-Q"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            <Radio className="w-3 h-3 text-emerald-600" />
                            via {q.source || "Bot"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 line-clamp-2">
                          {q.questionText}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {isUncategorized ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                              ⚠️ Needs Categorization
                            </span>
                          ) : (
                            q.categories.map((c) => (
                              <span
                                key={c.id}
                                className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                {c.name}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      <Link
                        to={ROUTES.QUESTIONS}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 shrink-0 self-center"
                      >
                        Review →
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Categories Breakdown + Quick Ministry Tools + Bot Status */}
        <div className="space-y-8">
          
          {/* Spiritual Categories Distribution */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Tag className="w-4 h-4" />
              </div>
              <h3 className="font-serif-eotc text-base font-bold text-slate-900">
                Question Topics Distribution
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              Breakdown of youth questions across theological and spiritual topics.
            </p>

            <div className="space-y-3 pt-1">
              {categoryCounts.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                      {cat.name}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {cat.count} questions ({cat.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(cat.percent, 100)}%` }}
                      className="bg-gradient-to-r from-amber-500 to-amber-700 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={ROUTES.CATEGORIES}
              className="mt-3 block text-center text-xs font-bold text-amber-700 hover:text-amber-900 pt-2 border-t border-slate-100"
            >
              + Manage & Create Categories • ምድቦች
            </Link>
          </div>

          {/* Quick Ministry Actions */}
          <div className="bg-gradient-to-br from-amber-50/60 to-white rounded-3xl border border-amber-300/40 p-6 shadow-sm space-y-3.5">
            <div className="flex items-center gap-2 pb-1">
              <EthiopianCross size={22} variant="gold" />
              <h3 className="font-serif-eotc text-base font-bold text-slate-900">
                Ministry Quick Tools
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                to={ROUTES.PROGRAM_CREATE}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-amber-400 text-xs font-bold text-slate-800 hover:text-amber-800 shadow-2xs transition"
              >
                <Plus className="w-4 h-4 text-amber-600" />
                <span>Schedule New Youth Program</span>
              </Link>

              <Link
                to={ROUTES.CATEGORIES}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-amber-400 text-xs font-bold text-slate-800 hover:text-amber-800 shadow-2xs transition"
              >
                <Tag className="w-4 h-4 text-amber-600" />
                <span>Manage & Create Categories</span>
              </Link>

              <Link
                to={ROUTES.QUESTIONS}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-amber-400 text-xs font-bold text-slate-800 hover:text-amber-800 shadow-2xs transition"
              >
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Review {uncategorizedQuestions.length} Uncategorized Inquiries</span>
              </Link>

              <Link
                to={ROUTES.USERS}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-amber-400 text-xs font-bold text-slate-800 hover:text-amber-800 shadow-2xs transition"
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Manage Clergy & Reviewers</span>
              </Link>

              <Link
                to={ROUTES.AUDIT_LOGS}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-amber-400 text-xs font-bold text-slate-800 hover:text-amber-800 shadow-2xs transition"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>View System Audit History</span>
              </Link>
            </div>
          </div>

          {/* System & Bot Health Status */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Platform Connectivity</span>
              <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </h4>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Telegram Bot Gateway</span>
                <span className="font-semibold text-emerald-700">Active</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span>Supabase Database</span>
                <span className="font-semibold text-emerald-700">Connected</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Clergy Reviewers</span>
                <span className="font-semibold text-slate-900">{activeClergyCount} logged</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/routePaths";
import EthiopianCross from "../../components/ui/EthiopianCross";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  BookOpen,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    ...(session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {}),
  };
}

export default function ProgramDetailsPage() {
  const { id } = useParams();

  const [program, setProgram] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // assign-category panel state
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchQuestions = useCallback(async () => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/programs/${id}/questions`, {
      headers,
    });
    if (res.ok) {
      const data = await res.json();
      setQuestions(data || []);
    }
  }, [id]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const headers = await getAuthHeaders();

      const [progRes, outcomesRes, catRes] = await Promise.all([
        fetch(`${API_URL}/api/programs/${id}`, { headers }),
        fetch(`${API_URL}/api/program-outcomes`, { headers }),
        fetch(`${API_URL}/api/categories`, { headers }),
      ]);

      const [progData, outcomeData, catData] = await Promise.all([
        progRes.json(),
        outcomesRes.json(),
        catRes.json(),
      ]);

      setProgram(progData);
      setOutcomes(outcomeData || []);
      setCategories(Array.isArray(catData) ? catData : []);
      await fetchQuestions();
      setLoading(false);
    };

    init();
  }, [id, fetchQuestions]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAssignCategory = async () => {
    if (!selectedCategoryId) return;
    setAssigning(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/programs/${id}/categories`, {
        method: "POST",
        headers,
        body: JSON.stringify({ categoryId: selectedCategoryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign category");

      const catName =
        categories.find((c) => String(c.id) === String(selectedCategoryId))?.name || "category";

      if (data.linked === 0) {
        setToast({ type: "info", message: `All questions from "${catName}" are already linked.` });
      } else {
        setToast({
          type: "success",
          message: `✓ ${data.linked} question${data.linked !== 1 ? "s" : ""} linked from "${catName}"`,
        });
      }

      await fetchQuestions();
      setSelectedCategoryId("");
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setAssigning(false);
    }
  };

  const handleOutcomeSave = async (pqId, outcomeId, notes) => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}/api/programs/questions/${pqId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ outcome_id: outcomeId, discussion_notes: notes }),
    });
    if (res.ok) await fetchQuestions();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <EthiopianCross size={40} variant="gold" className="animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading program details & assigned spiritual questions...
        </p>
      </div>
    );

  if (!program)
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm font-medium">
        Spiritual program not found.
      </div>
    );

  const toastColors = {
    success: "bg-emerald-50 border-emerald-300 text-emerald-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
    error: "bg-rose-50 border-rose-300 text-rose-800",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          to={ROUTES.PROGRAMS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50/70 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Programs</span>
        </Link>
      </div>

      {/* Main Program Header Card */}
      <div className="relative bg-white border border-amber-900/15 p-7 rounded-2xl shadow-sm overflow-hidden">
        {/* Top Gold Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded border border-amber-300">
              {program.reference_number || "PRG-REF"}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              {program.status?.name || "PLANNED"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-800 font-serif-eotc font-semibold">
            <EthiopianCross size={18} variant="gold" />
            <span>የወጣቶች መርሐ-ግብር ዝርዝር</span>
          </div>
        </div>

        <h1 className="font-serif-eotc text-2xl font-bold text-slate-900 tracking-tight">
          {program.title}
        </h1>

        {program.description && (
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {program.description}
          </p>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span className="font-semibold text-slate-800">
              {new Date(program.program_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>
              {program.start_time || "TBD"} – {program.end_time || "TBD"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>{program.location || "Location TBD"}</span>
          </div>
        </div>
      </div>

      {/* Topics summary */}
      {program.topics?.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Program Topics • የውይይት አርእስተ ነገሮች</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {program.topics.map((topic, i) => {
              const count = questions.filter((q) => q.topicId === topic.id).length;
              return (
                <div
                  key={topic.id}
                  className="bg-white border border-amber-900/10 p-4 rounded-xl shadow-xs"
                >
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                    Topic {i + 1}
                  </span>
                  <h4 className="font-bold text-slate-800 font-serif-eotc mt-0.5">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {count} question{count !== 1 ? "s" : ""} assigned
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assign Category Panel */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-serif-eotc">
              Auto-Link Category Questions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a spiritual question category to automatically assign all tagged questions to this session.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-center flex-wrap pt-1">
          <select
            id="assign-category-select"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="flex-1 min-w-[240px] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium bg-slate-50 focus:bg-white text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            <option value="">Select a category to link questions...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            id="assign-category-btn"
            onClick={handleAssignCategory}
            disabled={!selectedCategoryId || assigning}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{assigning ? "Linking Questions..." : "Assign Category"}</span>
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-xs font-semibold transition-all ${toastColors[toast.type]}`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        )}
      </div>

      {/* Assigned Questions List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif-eotc">
              Assigned Youth Questions
            </h2>
            <p className="text-xs text-slate-500">
              Live discussion tracker and clergy answer resolution.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
            {questions.length} Questions
          </span>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
            <p>No questions linked to this program yet.</p>
            <p className="text-slate-500">
              Use the category selector above to link questions for discussion.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((pq) => (
              <QuestionRow
                key={pq.programQuestionId}
                pq={pq}
                outcomes={outcomes}
                onSave={handleOutcomeSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── QuestionRow ──────────────────────────────────────────────────────────────
function QuestionRow({ pq, outcomes, onSave }) {
  const [selectedOutcomeId, setSelectedOutcomeId] = useState(pq.outcome?.id || "");
  const [notes, setNotes] = useState(pq.discussionNotes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedOutcomeId(pq.outcome?.id || "");
    setNotes(pq.discussionNotes || "");
  }, [pq.outcome?.id, pq.discussionNotes]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(pq.programQuestionId, selectedOutcomeId, notes);
    setSaving(false);
  };

  const outcomeColors = {
    ADDRESSED: "text-emerald-800 bg-emerald-50 border-emerald-300",
    PARTIALLY_ADDRESSED: "text-amber-800 bg-amber-50 border-amber-300",
    DEFERRED: "text-blue-800 bg-blue-50 border-blue-300",
    NOT_ADDRESSED: "text-slate-600 bg-slate-100 border-slate-200",
  };
  const badgeClass = outcomeColors[pq.outcome?.code] || outcomeColors.NOT_ADDRESSED;

  return (
    <div className="py-5 space-y-3.5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded">
              {pq.question?.referenceNumber || "Q-REF"}
            </span>
            {pq.question?.categories?.map((c) => (
              <span
                key={c.id}
                className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium"
              >
                {c.name}
              </span>
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-snug">
            {pq.question?.questionText}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold border px-2.5 py-1 rounded-full ${badgeClass}`}>
            {pq.outcome?.name || "Not Addressed"}
          </span>
          {pq.addressedAt && (
            <span className="text-[11px] text-slate-400 font-mono">
              {new Date(pq.addressedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200/60">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Discussion Outcome
          </label>
          <select
            value={selectedOutcomeId}
            onChange={(e) => setSelectedOutcomeId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            {outcomes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
            Clergy / Spiritual Notes & References
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record biblical references, clergy answers, or takeaways..."
              className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3 h-3" />
              <span>{saving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { fetchQuestions } from "../../Services/questionService";
import EthiopianCross from "../../components/ui/EthiopianCross";
import {
  MessageSquare,
  Search,
  Tag,
  Plus,
  X,
  Filter,
  CheckCircle2,
  HelpCircle,
  Radio,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePickerId, setActivePickerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("ALL"); // 'ALL' | 'UNCATEGORIZED' | categoryId

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [questionsData, { data: categoriesData }] = await Promise.all([
        fetchQuestions(),
        supabase.from("categories").select("*").order("name"),
      ]);

      setQuestions(questionsData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignCategory(questionId, categoryId) {
    if (!categoryId) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(
        `${API_URL}/api/questions/${questionId}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token || ""}`,
          },
          body: JSON.stringify({ categoryId }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to assign category");
        } else {
          const text = await response.text();
          throw new Error(`Server status ${response.status}: ${text.slice(0, 100)}`);
        }
      }

      const selectedCat = categories.find((c) => String(c.id) === String(categoryId));
      const currentUserName =
        session?.user?.user_metadata?.full_name ||
        session?.user?.email ||
        "Clergy Reviewer";

      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            const exists = q.categories?.some((c) => String(c.id) === String(categoryId));
            if (exists) return q;
            return {
              ...q,
              categories: [
                ...(q.categories || []),
                { ...selectedCat, assignedBy: currentUserName },
              ],
            };
          }
          return q;
        })
      );

      setActivePickerId(null);
    } catch (err) {
      alert(`Failed to assign category: ${err.message}`);
    }
  }

  async function handleRemoveCategory(questionId, categoryId) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(
        `${API_URL}/api/questions/${questionId}/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.access_token || ""}`,
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to remove category");
        } else {
          const text = await response.text();
          throw new Error(`Server status ${response.status}: ${text.slice(0, 100)}`);
        }
      }

      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              categories: q.categories.filter((c) => String(c.id) !== String(categoryId)),
            };
          }
          return q;
        })
      );
    } catch (err) {
      alert(`Failed to remove category: ${err.message}`);
    }
  }

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        q.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilterCategory === "ALL") return true;
      if (selectedFilterCategory === "UNCATEGORIZED") {
        return !q.categories || q.categories.length === 0;
      }
      return q.categories?.some((c) => String(c.id) === String(selectedFilterCategory));
    });
  }, [questions, searchQuery, selectedFilterCategory]);

  const uncategorizedCount = questions.filter(
    (q) => !q.categories || q.categories.length === 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
              የወጣቶች ጥያቄዎች • Review
            </span>
          </div>
          <h1 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
            Questions Review & Spiritual Categorization
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review questions submitted by youth and assign theological & spiritual categories for upcoming church programs.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-slate-700">
              {questions.length} Total Questions
            </span>
          </div>
          {uncategorizedCount > 0 && (
            <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-amber-800">
                {uncategorizedCount} Need Review
              </span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-sm border border-rose-200">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by spiritual question or ref number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedFilterCategory("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFilterCategory === "ALL"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              All ({questions.length})
            </button>

            <button
              onClick={() => setSelectedFilterCategory("UNCATEGORIZED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFilterCategory === "UNCATEGORIZED"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              Uncategorized ({uncategorizedCount})
            </button>

            {categories.map((cat) => {
              const count = questions.filter((q) =>
                q.categories?.some((c) => String(c.id) === String(cat.id))
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    String(selectedFilterCategory) === String(cat.id)
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Questions Card Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center flex flex-col items-center space-y-3">
            <EthiopianCross size={40} variant="gold" className="animate-spin" />
            <p className="text-sm font-medium text-slate-500">
              Loading submitted questions...
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-amber-50 border border-amber-200">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-base font-semibold text-slate-800 font-serif-eotc">
              No questions found
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No spiritual inquiries match the selected filter or search term.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredQuestions.map((q) => {
              const availableCategories = categories.filter(
                (c) => !(q.categories || []).some((qc) => String(qc.id) === String(c.id))
              );

              return (
                <div
                  key={q.id}
                  className="p-6 hover:bg-amber-50/20 transition-colors flex flex-col sm:flex-row items-start justify-between gap-5"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-0.5 rounded">
                        {q.referenceNumber || "REF-Q"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        <Radio className="w-3 h-3 text-emerald-600" />
                        <span>via {q.source || "Bot"}</span>
                      </span>
                    </div>

                    <p className="text-slate-900 font-semibold text-base leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* Assigned Categories Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {q.categories && q.categories.length > 0 ? (
                        q.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs"
                          >
                            <Tag className="w-3 h-3 text-amber-600" />
                            <span>{cat.name}</span>
                            {cat.assignedBy && (
                              <span className="text-[10px] text-amber-700/80 bg-amber-100 px-1.5 py-0.5 rounded">
                                {cat.assignedBy}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(q.id, cat.id)}
                              className="text-amber-500 hover:text-rose-700 font-bold ml-1 transition-colors cursor-pointer"
                              title="Remove category"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50/80 border border-amber-200/60 px-2.5 py-0.5 rounded-md font-medium">
                          <span>⚠️ Unassigned to any category</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side Category Picker */}
                  <div className="flex flex-col items-end gap-2 shrink-0 self-end sm:self-start">
                    {activePickerId === q.id ? (
                      <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-amber-300 shadow-sm">
                        <select
                          defaultValue=""
                          onChange={(e) => handleAssignCategory(q.id, e.target.value)}
                          className="text-xs rounded-lg border-0 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="" disabled>
                            Select spiritual category...
                          </option>
                          {availableCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => setActivePickerId(null)}
                          className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      availableCategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActivePickerId(q.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 px-3.5 py-2 border border-amber-200/80 hover:bg-amber-200 transition-all shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-amber-700" />
                          <span>Assign Category</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
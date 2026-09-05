import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { fetchQuestions } from "../../Services/questionService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePickerId, setActivePickerId] = useState(null);

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

      setQuestions(questionsData);
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

      const selectedCat = categories.find((c) => c.id === categoryId);
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            const exists = q.categories?.some((c) => c.id === categoryId);
            if (exists) return q;
            return {
              ...q,
              categories: [...(q.categories || []), selectedCat],
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
              categories: q.categories.filter((c) => c.id !== categoryId),
            };
          }
          return q;
        })
      );
    } catch (err) {
      alert(`Failed to remove category: ${err.message}`);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold text-slate-900">Questions Review</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review submitted questions and manage content categorization.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No questions found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {questions.map((q) => {
              const availableCategories = categories.filter(
                (c) => !(q.categories || []).some((qc) => qc.id === c.id)
              );

              return (
                <div key={q.id} className="p-5 flex items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                        {q.referenceNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        via {q.source}
                      </span>
                    </div>

                    <p className="text-slate-800 font-medium text-base">
                      {q.questionText}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {q.categories && q.categories.length > 0 ? (
                        q.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
                          >
                            {cat.name}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(q.id, cat.id)}
                              className="text-orange-500 hover:text-orange-900 font-bold ml-0.5"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Uncategorized
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {activePickerId === q.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => handleAssignCategory(q.id, e.target.value)}
                          className="text-xs rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 focus:border-orange-500 focus:outline-none"
                        >
                          <option value="" disabled>
                            Select category...
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
                          className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      availableCategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActivePickerId(q.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-orange-50 text-orange-600 px-3 py-1.5 border border-orange-200 hover:bg-orange-100 transition-colors"
                        >
                          + Categorize
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
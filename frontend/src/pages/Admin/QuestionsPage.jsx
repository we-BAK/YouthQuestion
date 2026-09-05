// frontend/src/pages/QuestionsPage.jsx
import { useEffect, useState } from "react";
import { fetchQuestions } from "../../services/questionService";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    if (activeTab === "all") return true;
    if (activeTab === "new") return q.status === "NEW" || q.status === "New";
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
          Administration
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Questions Overview</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and manage spiritual questions submitted via Telegram.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          All Questions ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "new"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          New Submissions
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading questions...
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No questions found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                      {q.referenceNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      via {q.source}
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    {q.status}
                  </span>
                </div>

                <p className="text-slate-800 text-base font-medium mt-2">
                  {q.questionText}
                </p>

                <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                  <span>
                    {q.createdAt ? new Date(q.createdAt).toLocaleString() : "Date unknown"}
                  </span>
                  <span>{q.isAnonymous ? "Anonymous User" : "Telegram User"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
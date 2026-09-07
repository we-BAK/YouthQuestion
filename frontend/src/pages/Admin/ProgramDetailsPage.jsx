import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProgramDetailsPage() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [outcomes, setOutcomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const [progRes, outcomesRes] = await Promise.all([
      fetch(`/api/programs/${id}`),
      fetch("/api/program-outcomes"), // Returns list from program_question_outcomes table
    ]);

    const progData = await progRes.json();
    const outcomeData = await outcomesRes.json();

    setProgram(progData);
    setOutcomes(outcomeData);
    setLoading(false);
  };

  const handleOutcomeSave = async (pqId, outcomeId, notes) => {
    const res = await fetch(`/api/programs/questions/${pqId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outcome_id: outcomeId, discussion_notes: notes }),
    });

    if (res.ok) {
      fetchData();
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading program details...</div>;
  if (!program) return <div className="p-8 text-rose-500">Program not found.</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-6">
      {/* Header Summary */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl flex justify-between items-start shadow-sm">
        <div>
          <div className="flex gap-2 items-center mb-2">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              {program.reference_number}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded">
              STATUS: {program.status?.name || "N/A"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{program.title}</h1>
          <p className="text-slate-500 text-sm mt-1">
            📍 {program.location || "Location TBD"} | 📅 {new Date(program.program_date).toLocaleDateString()} | ⏰ {program.start_time} - {program.end_time}
          </p>
        </div>
      </div>

      {/* Program Topics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {program.topics?.map((topic, i) => {
          const topicQuestionsCount = program.questions?.filter((q) => q.topic_id === topic.id).length || 0;
          return (
            <div key={topic.id} className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <span className="text-xs font-bold text-orange-600">Topic {i + 1}</span>
              <h4 className="font-bold text-slate-800">{topic.title}</h4>
              <p className="text-xs text-slate-500 mt-2">{topicQuestionsCount} questions assigned</p>
            </div>
          );
        })}
      </div>

      {/* Questions & Live Outcome Logging */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">Assigned Questions Execution</h2>

        <div className="divide-y divide-slate-100">
          {program.questions?.map((pq) => (
            <QuestionRow key={pq.id} pq={pq} outcomes={outcomes} onSave={handleOutcomeSave} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionRow({ pq, outcomes, onSave }) {
  const [selectedOutcomeId, setSelectedOutcomeId] = useState(pq.outcome?.id || "");
  const [notes, setNotes] = useState(pq.discussion_notes || "");

  return (
    <div className="py-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono font-bold text-orange-600 mr-2">
            {pq.question?.reference_code || "Q-REF"}
          </span>
          <span className="font-medium text-slate-800">{pq.question?.question}</span>
        </div>
        {pq.addressed_at && (
          <span className="text-xs text-slate-400 font-mono">
            Recorded: {new Date(pq.addressed_at).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Outcome</label>
          <select
            value={selectedOutcomeId}
            onChange={(e) => setSelectedOutcomeId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white"
          >
            {outcomes.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Discussion Notes</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record notes..."
              className="flex-1 border border-slate-200 rounded-lg p-2 text-sm"
            />
            <button
              onClick={() => onSave(pq.id, selectedOutcomeId, notes)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
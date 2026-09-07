import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProgramPage() {
  const navigate = useNavigate();

  // Lookups loaded from DB
  const [programTypes, setProgramTypes] = useState([]);
  const [programStatuses, setProgramStatuses] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    program_type_id: "",
    status_id: "",
    program_date: "",
    start_time: "14:00",
    end_time: "17:00",
    location: "",
  });

  // Topics/Categories List
  const [topics, setTopics] = useState([
    { title: "Prayer", description: "" },
    { title: "Faith and Doubt", description: "" },
  ]);

  // Selected Questions mapping: { [question_id]: topic_index }
  const [selectedQuestions, setSelectedQuestions] = useState({});

  useEffect(() => {
    // Fetch initial lookup options and questions from backend
    Promise.all([
      fetch("/api/program-types").then((r) => r.json()),
      fetch("/api/program-statuses").then((r) => r.json()),
      fetch("/api/questions").then((r) => r.json()),
    ]).then(([types, statuses, questions]) => {
      setProgramTypes(types);
      setProgramStatuses(statuses);
      setAvailableQuestions(questions.questions || questions || []);

      // Default status to 'SCHEDULED' or 'PLANNED' if present
      const defaultStatus = statuses.find((s) => s.code === "SCHEDULED" || s.code === "PLANNED");
      if (defaultStatus) {
        setFormData((prev) => ({ ...prev, status_id: defaultStatus.id }));
      }
      if (types.length > 0) {
        setFormData((prev) => ({ ...prev, program_type_id: types[0].id }));
      }
    });
  }, []);

  // Dynamic Topic Handlers
  const handleAddTopic = () => setTopics([...topics, { title: "", description: "" }]);
  const handleRemoveTopic = (index) => setTopics(topics.filter((_, i) => i !== index));
  const handleTopicChange = (index, field, value) => {
    const updated = [...topics];
    updated[index][field] = value;
    setTopics(updated);
  };

  // Question Selection Handlers
  const toggleQuestionSelection = (qId) => {
    const next = { ...selectedQuestions };
    if (next[qId] !== undefined) {
      delete next[qId];
    } else {
      next[qId] = 0; // Default assigned to the first topic
    }
    setSelectedQuestions(next);
  };

  const handleAssignQuestionTopic = (qId, topicIndex) => {
    setSelectedQuestions({
      ...selectedQuestions,
      [qId]: parseInt(topicIndex, 10),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      topics,
      questions: Object.entries(selectedQuestions).map(([qId, topicIdx]) => ({
        question_id: qId,
        topic_index: topicIdx,
      })),
    };

    const res = await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      navigate("/admin/programs");
    } else {
      const err = await res.json();
      alert(`Failed to create program: ${err.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-16 pt-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create New Youth Program</h1>
        <p className="text-slate-500 text-sm">Configure event schedule, topics/categories, and assigned questions.</p>
      </div>

      {/* 1. Basic Information */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">1. Basic Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Program Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
              placeholder="e.g., Youth Question & Discussion"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Program Type</label>
            <select
              value={formData.program_type_id}
              onChange={(e) => setFormData({ ...formData, program_type_id: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
            >
              {programTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            placeholder="Brief overview..."
          />
        </div>
      </div>

      {/* 2. Schedule & Location */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">2. Schedule & Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              value={formData.status_id}
              onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
            >
              {programStatuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
            <input
              type="date"
              required
              value={formData.program_date}
              onChange={(e) => setFormData({ ...formData, program_date: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Start Time</label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">End Time</label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            placeholder="e.g., St. Gabriel Hall"
          />
        </div>
      </div>

      {/* 3. Program Topics / Categories */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">3. Program Topics / Categories</h2>
          <button
            type="button"
            onClick={handleAddTopic}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-lg"
          >
            + Add Topic
          </button>
        </div>

        <div className="space-y-3">
          {topics.map((t, idx) => (
            <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-mono font-bold text-slate-400 w-6">#{idx + 1}</span>
              <input
                type="text"
                required
                value={t.title}
                onChange={(e) => handleTopicChange(idx, "title", e.target.value)}
                placeholder="Topic Title (e.g., Prayer)"
                className="flex-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
              />
              <button
                type="button"
                onClick={() => handleRemoveTopic(idx)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Question Selection & Topic Assignment */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">4. Select Questions for Program</h2>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto border border-slate-200 rounded-lg p-2">
          {availableQuestions.length === 0 ? (
            <p className="p-4 text-xs text-slate-400 text-center">No questions found in database.</p>
          ) : (
            availableQuestions.map((q) => {
              const isSelected = selectedQuestions[q.id] !== undefined;
              return (
                <div key={q.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleQuestionSelection(q.id)}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded mr-2">
                        {q.reference_code || "Q-REF"}
                      </span>
                      <span className="text-sm text-slate-800">{q.question || q.title}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Assign to:</span>
                      <select
                        value={selectedQuestions[q.id]}
                        onChange={(e) => handleAssignQuestionTopic(q.id, e.target.value)}
                        className="text-xs border border-slate-300 rounded-md p-1.5 bg-white font-medium"
                      >
                        {topics.map((t, idx) => (
                          <option key={idx} value={idx}>
                            Topic #{idx + 1}: {t.title || "Untitled"}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
      >
        Save & Schedule Program
      </button>
    </form>
  );
}
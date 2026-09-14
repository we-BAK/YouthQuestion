import React from "react";

export default function ProgramTopicsSection({
  topics,
  availableCategories,
  onAddTopic,
  onRemoveTopic,
  onCategorySelect,
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">3. Select Categories / Topics</h2>
        <button
          type="button"
          onClick={onAddTopic}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 bg-orange-50 px-3 py-1.5 rounded-lg"
        >
          + Add Topic Category
        </button>
      </div>

      <div className="space-y-3">
        {topics.map((t, idx) => (
          <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-mono font-bold text-slate-400 w-6">#{idx + 1}</span>

            <select
              required
              value={t.category_id}
              onChange={(e) => onCategorySelect(idx, e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
            >
              <option value="">-- Select Category --</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name || cat.title || cat.category_name || cat.topic_name || `Category ${cat.id}`}
                </option>
              ))}
            </select>

            {topics.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveTopic(idx)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
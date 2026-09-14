import React from "react";

export default function ProgramQuestionsSection({
  topics,
  selectedCategoryIds,
  filteredQuestions,
  selectedQuestions,
  onToggleQuestion,
  onAssignTopic,
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">4. Program Questions</h2>
        <span className="text-xs font-semibold text-slate-500">
          {Object.keys(selectedQuestions).length} Questions Selected
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto border border-slate-200 rounded-lg p-2">
        {selectedCategoryIds.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-sm font-medium text-slate-600">No categories selected</p>
            <p className="text-xs text-slate-400 mt-1">
              Please select at least one category in Step 3 to view and select relevant questions.
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-400">
              No questions found in the database for the selected category/categories.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isSelected = selectedQuestions[q.id] !== undefined;

            // Extract all linked category IDs attached from question_categories junction table
            const linkedCategories = (q.question_categories || []).map((qc) =>
              String(qc.category_id).trim().toLowerCase()
            );

            if (q.category_id) {
              linkedCategories.push(String(q.category_id).trim().toLowerCase());
            }

            // Find matching index in topics array
            const matchingTopicIdx = topics.findIndex((t) =>
              linkedCategories.includes(String(t.category_id).trim().toLowerCase())
            );
            const defaultTopicIdx = matchingTopicIdx >= 0 ? matchingTopicIdx : 0;

            return (
              <div key={q.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleQuestion(q.id, defaultTopicIdx)}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded mr-2">
                      {q.reference_code || q.code || "Q-REF"}
                    </span>
                    <span className="text-sm text-slate-800">
                      {q.question || q.title || q.text || q.question_text}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Assigned Topic:</span>
                    <select
                      value={selectedQuestions[q.id]}
                      onChange={(e) => onAssignTopic(q.id, e.target.value)}
                      className="text-xs border border-slate-300 rounded-md p-1.5 bg-white font-medium"
                    >
                      {topics.map((top, idx) => (
                        <option key={idx} value={idx}>
                          Topic #{idx + 1}: {top.title || "Unselected"}
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
  );
}

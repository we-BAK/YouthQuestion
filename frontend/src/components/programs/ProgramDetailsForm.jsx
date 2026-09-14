import React from "react";
import { BookOpen } from "lucide-react";

export default function ProgramDetailsForm({ formData, setFormData, programTypes }) {
  return (
    <div className="bg-white p-7 rounded-2xl border border-slate-200/90 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
          <BookOpen className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900 font-serif-eotc">
          1. Program Details & Title • የመርሐ-ግብር ዝርዝር
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Program Title * (የመርሐ-ግብር ርእስ)
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="e.g., የኦርቶዶክስ ወጣቶች መንፈሳዊ የውይይት መድረክ"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Program Type (ዓይነት)</label>
          <select
            value={formData.program_type_id}
            onChange={(e) => setFormData({ ...formData, program_type_id: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-white text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            {programTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name || t.type_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Description (መግለጫ)</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          placeholder="Detailed overview, spiritual themes, expected youth audience..."
        />
      </div>
    </div>
  );
}
import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function ProgramScheduleForm({ formData, setFormData, programStatuses }) {
  return (
    <div className="bg-white p-7 rounded-2xl border border-slate-200/90 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
          <Calendar className="w-4 h-4" />
        </div>
        <h2 className="text-base font-bold text-slate-900 font-serif-eotc">
          2. Schedule & Gathering Venue • ቀንና ቦታ
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
          <select
            value={formData.status_id}
            onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs bg-white text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            {programStatuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name || s.status_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
          <input
            type="date"
            required
            value={formData.program_date}
            onChange={(e) => setFormData({ ...formData, program_date: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Church Hall / Venue (የመሰብሰቢያ አዳራሽ / ቦታ)
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="e.g. ቅዱስ ገብርኤል አዳራሽ (St. Gabriel Hall) / Main Youth Hall"
          />
        </div>
      </div>
    </div>
  );
}
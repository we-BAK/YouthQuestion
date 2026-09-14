import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import EthiopianCross from "../../components/ui/EthiopianCross";
import { RotateCw, ShieldAlert, FileText } from "lucide-react";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch("/api/audit-logs", {
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch logs`);
      }

      setLogs(data || []);
    } catch (err) {
      console.error("❌ Audit logs error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (action) => {
    switch (action) {
      case "INSERT":
      case "CREATE_PROGRAM":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "UPDATE":
        return "bg-blue-50 text-blue-800 border-blue-300";
      case "DELETE":
        return "bg-rose-50 text-rose-800 border-rose-300";
      default:
        return "bg-amber-50 text-amber-800 border-amber-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
              የስርዓት ክትትል • Audit Trail
            </span>
          </div>
          <h2 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
            System Activity & Audit Logs
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Track authorized operations, question classifications, and program modifications.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-600" : ""}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        {loading ? (
          <div className="p-16 text-center flex flex-col items-center space-y-3">
            <EthiopianCross size={36} variant="gold" className="animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading audit trail...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5">Administrator / Performer</th>
                <th className="py-3.5 px-5">Operation</th>
                <th className="py-3.5 px-5">Target Entity</th>
                <th className="py-3.5 px-5">Payload Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3.5 px-5 whitespace-nowrap text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {log.performedBy || "System Admin"}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 font-bold rounded-full border ${getBadgeStyle(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-700">
                      {log.entityType || "N/A"}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-600">
                      {log.newValues && (
                        <div className="max-w-md truncate">
                          <span className="text-amber-700 font-semibold">New:</span>{" "}
                          {JSON.stringify(log.newValues)}
                        </div>
                      )}
                      {log.oldValues && (
                        <div className="max-w-md truncate text-slate-400">
                          <span className="font-semibold">Old:</span>{" "}
                          {JSON.stringify(log.oldValues)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
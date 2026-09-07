// src/components/AuditLogs.jsx
import React, { useEffect, useState } from "react";

export default function AuditLogs({ token }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/audit-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action) => {
    switch (action) {
      case "INSERT":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">INSERT</span>;
      case "UPDATE":
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">UPDATE</span>;
      case "DELETE":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">DELETE</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">{action}</span>;
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading audit logs...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">System Audit Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Timestamp</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">User</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Entity</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{log.performedBy}</td>
                <td className="px-4 py-3">{getActionBadge(log.action)}</td>
                <td className="px-4 py-3 text-gray-700">{log.entityType || "N/A"}</td>
                <td className="px-4 py-3 text-xs font-mono text-gray-600">
                  {log.newValues && (
                    <div>
                      <strong>New:</strong> {JSON.stringify(log.newValues)}
                    </div>
                  )}
                  {log.oldValues && (
                    <div className="text-gray-400">
                      <strong>Old:</strong> {JSON.stringify(log.oldValues)}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
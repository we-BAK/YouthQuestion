import React, { useState } from "react";
import AuditLogs from "./components/AuditLogs";

export default function AdminDashboard({ token }) {
  const [activeTab, setActiveTab] = useState("questions"); // 'questions' | 'audit'

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6 gap-4">
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-2 px-1 text-sm font-semibold border-b-2 ${
            activeTab === "questions"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Questions Management
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-2 px-1 text-sm font-semibold border-b-2 ${
            activeTab === "audit"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "questions" && (
        <div>
          {/* Your Questions Table Component */}
        </div>
      )}

      {activeTab === "audit" && (
        <AuditLogs token={token} />
      )}
    </div>
  );
}
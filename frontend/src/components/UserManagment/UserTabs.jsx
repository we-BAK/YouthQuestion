export default function UserTabs({
  activeTab,
  setActiveTab,
  totalUsers,
  activeUsers,
}) {
  return (
    <div className="flex border-b border-slate-200 gap-6">

      <Tab
        active={activeTab === "all"}
        onClick={() => setActiveTab("all")}
      >
        All Users ({totalUsers})
      </Tab>

      <Tab
        active={activeTab === "active"}
        onClick={() => setActiveTab("active")}
      >
        Active Clergy & Reviewers ({activeUsers})
      </Tab>

    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
        active
          ? "border-amber-600 text-amber-700"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
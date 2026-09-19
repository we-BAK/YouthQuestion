import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { useAuth } from "../../context/AuthContext";
import EthiopianCross from "../ui/EthiopianCross";
import TibebRibbon from "../ui/TibebRibbon";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, role, hasPermission, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Spiritual Ministry Dashboard";
    if (path.includes("/admin/programs/new")) return "Create New Program";
    if (path.match(/\/admin\/programs\/\d+/)) return "Program Details & Questions";
    if (path.includes("/admin/programs")) return "Spiritual Programs & Gatherings";
    if (path.includes("/admin/questions")) return "Youth Inquiries & Questions Review";
    if (path.includes("/admin/categories")) return "Question Categories & Taxonomies";
    if (path.includes("/admin/users")) return "User & Clergy Management";
    if (path.includes("/admin/audit-logs")) return "System Audit History";
    if (path.includes("/admin/roles-permissions")) return "Roles & Permissions Management";
    if (path.includes("/admin/settings")) return "Platform Settings & Security";
    return "Administration Portal";
  };

  const navItems = [
    {
      to: ROUTES.DASHBOARD,
      label: "Ministry Dashboard",
      amharic: "ዳሽቦርድ (አጠቃላይ እይታ)",
      icon: LayoutDashboard,
    },
    {
      to: ROUTES.PROGRAMS,
      label: "Programs Management",
      amharic: "የመርሐ-ግብር አስተዳደር",
      icon: Calendar,
      permission: "PROGRAMS_VIEW",
    },
    {
      to: ROUTES.QUESTIONS,
      label: "Questions Review",
      amharic: "የጥያቄዎች ምርመራ",
      icon: MessageSquare,
      permission: "QUESTIONS_VIEW",
    },
    {
      to: ROUTES.CATEGORIES,
      label: "Question Categories",
      amharic: "የጥያቄ ምድቦች (ማደራጃ)",
      icon: Tag,
      permission: "CATEGORIES_VIEW",
    },
    {
      to: ROUTES.USERS,
      label: "User Management",
      amharic: "የአባላት አስተዳደር",
      icon: Users,
      permission: "USERS_VIEW",
    },
    {
      to: ROUTES.ROLES_PERMISSIONS,
      label: "Roles & Permissions",
      amharic: "የሚናና ፈቃዶች አስተዳደር",
      icon: ShieldCheck,
      permission: "ROLES_VIEW",
    },
    {
      to: ROUTES.AUDIT_LOGS,
      label: "Audit Logs",
      amharic: "የስርዓት መዝገብ",
      icon: FileText,
      permission: "AUDIT_LOGS_VIEW",
    },
    {
      to: ROUTES.SETTINGS,
      label: "Settings & Security",
      amharic: "ቅንብሮችና ደህንነት",
      icon: Settings,
      permission: "SETTINGS_VIEW",
    },
  ];

  // Dynamically filter items so revoked permissions immediately remove links
  const visibleNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-[#f8f6f1] flex flex-col text-slate-800">
      {/* Top Traditional Tibeb Ribbon Accent */}
      <TibebRibbon className="h-1.5 w-full fixed top-0 left-0 z-50 shadow-sm" />

      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-[#0c1322] border-r border-amber-950/40 flex flex-col justify-between z-40 text-slate-300 shadow-2xl pt-1.5 max-h-screen">
        {/* Top Header & Scrollable Navigation Container */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Church Branding Header (Fixed top inside sidebar) */}
          <div className="p-6 border-b border-amber-500/15 bg-gradient-to-b from-[#141d33] to-[#0c1322] shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/30 shadow-inner">
                <EthiopianCross size={34} variant="gold" />
              </div>
              <div>
                <h2 className="font-serif-eotc text-base font-bold tracking-wide text-amber-300 leading-tight">
                  EOTC Youth Ministry
                </h2>
                <p className="text-[11px] text-amber-200/70 font-medium tracking-wider">
                  የኢ/ኦ/ተ/ቤ/ክ ወጣቶች መድረክ
                </p>
              </div>
            </div>

            {/* Liturgical Motto Pill */}
            <div className="mt-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>✞ በእምነትና በምግባር ማነጽ</span>
            </div>
          </div>

          {/* Scrollable Navigation Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto flex-1 min-h-0 custom-sidebar-scrollbar">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Ministry Operations
            </p>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-900/40 border border-amber-400/30 font-semibold translate-x-1"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-amber-300 hover:translate-x-0.5"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? "text-amber-100" : "text-slate-400 group-hover:text-amber-400"
                          }`}
                        />
                        <div className="flex flex-col text-left">
                          <span>{item.label}</span>
                          <span
                            className={`text-[10px] ${
                              isActive ? "text-amber-100/80" : "text-slate-500 group-hover:text-amber-300/70"
                            }`}
                          >
                            {item.amharic}
                          </span>
                        </div>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-200" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Status & Sign Out Footer (Pinned to bottom) */}
        <div className="p-4 border-t border-slate-800 bg-[#080d18]/60 space-y-3 shrink-0">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-600 to-rose-800 flex items-center justify-center text-white font-bold text-xs shadow-md border border-amber-400/30">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "E"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {profile?.full_name || user?.user_metadata?.full_name || user?.email || "Staff User"}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-amber-400">
                <ShieldCheck className="w-3 h-3" />
                <span className="truncate">{role?.name || profile?.role || "Authorized User"}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out • ውጣ</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-72 flex-1 flex flex-col pt-1.5">
        {/* Top Navbar */}
        <header className="sticky top-1.5 z-30 flex h-16 items-center justify-between border-b border-amber-900/10 bg-white/90 backdrop-blur-md px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-1 rounded-full bg-amber-600" />
            <div>
              <h1 className="font-serif-eotc text-lg font-bold text-slate-900">
                {getPageTitle()}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን የወጣቶች መንፈሳዊ አገልግሎት መድረክ
              </p>
            </div>
          </div>

          {/* Right Header Status Bar */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/70 text-xs font-medium text-amber-800">
              <span className="text-sm">📅</span>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Bot Online</span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-8 max-w-7xl w-full mx-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes/routePaths";
import { useAuth } from "../../context/AuthContext";
import EthiopianCross from "../ui/EthiopianCross";
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
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, role, hasPermission, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  async function handleLogout() {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/programs/new")) return "Create Program";
    if (path.match(/\/admin\/programs\/\d+/)) return "Program Details";
    if (path.includes("/admin/programs")) return "Programs & Gatherings";
    if (path.includes("/admin/questions")) return "Questions Review";
    if (path.includes("/admin/categories")) return "Categories";
    if (path.includes("/admin/users")) return "User Management";
    if (path.includes("/admin/audit-logs")) return "Audit Logs";
    if (path.includes("/admin/roles-permissions")) return "Roles & Permissions";
    if (path.includes("/admin/settings")) return "Settings";
    return "Portal";
  };

  const navItems = [
    {
      to: ROUTES.DASHBOARD,
      label: "Dashboard",
      amharic: "አጠቃላይ እይታ",
      icon: LayoutDashboard,
    },
    {
      to: ROUTES.PROGRAMS,
      label: "Programs",
      amharic: "መርሐ-ግብራት",
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
      label: "Categories",
      amharic: "የጥያቄ ምድቦች",
      icon: Tag,
      permission: "CATEGORIES_VIEW",
    },
    {
      to: ROUTES.USERS,
      label: "Users & Clergy",
      amharic: "የአባላት አስተዳደር",
      icon: Users,
      permission: "USERS_VIEW",
    },
    {
      to: ROUTES.ROLES_PERMISSIONS,
      label: "Roles & Access",
      amharic: "ሚናና ፈቃዶች",
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
      label: "Settings",
      amharic: "ቅንብሮች",
      icon: Settings,
      permission: "SETTINGS_VIEW",
    },
  ];

  const visibleNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-800 antialiased font-sans">
      
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation (Linear / Stripe Executive Style) */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-[#090d16] border-r border-slate-800/60 flex flex-col justify-between z-50 text-slate-300 shadow-2xl max-h-screen transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          
          {/* Executive Brand Header */}
          <div className="px-5 py-4 border-b border-slate-800/60 bg-[#070a12] shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <EthiopianCross size={22} variant="gold" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-white leading-tight">
                    EOTC Youth Ministry
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Review & Gathering Portal
                  </p>
                </div>
              </div>

              {/* Close Button on Mobile */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Liturgical Tag */}
            <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-amber-300/80 font-medium">
              <span className="truncate">✞ በእምነትና በምግባር ማነጽ</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 ml-1" />
            </div>
          </div>

          {/* Navigation Items (Pill Style) */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 min-h-0">
            <p className="px-3 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Operations
            </p>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-white/[0.08] text-white border border-white/[0.08] shadow-xs font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-300"
                          }`}
                        />
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate">{item.label}</span>
                          <span className="text-[10px] text-slate-500 font-normal hidden sm:inline truncate">
                            • {item.amharic}
                          </span>
                        </div>
                      </div>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 ml-1" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Sign Out */}
        <div className="p-3.5 border-t border-slate-800/60 bg-[#070a12] space-y-2 shrink-0">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-xs">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : "E"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-slate-200 truncate leading-tight">
                {profile?.full_name || user?.user_metadata?.full_name || user?.email || "Staff User"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {role?.name || profile?.role || "Authorized Staff"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-0 lg:pl-72 flex-1 flex flex-col min-w-0">
        
        {/* Top Executive Header */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
              <span className="hidden sm:inline">Ministry Portal</span>
              <span className="hidden sm:inline">/</span>
              <h1 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Status Bar */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60">
              <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Bot Online</span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
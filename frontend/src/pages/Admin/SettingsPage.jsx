import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import EthiopianCross from "../../components/ui/EthiopianCross";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  User,
  ShieldCheck,
  Mail,
  Sliders,
  Bell,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  // Get live RBAC profile and role from AuthContext
  const { user, profile, role } = useAuth();
  const currentUser = user;

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Notification / preference toggles
  const [notifyOnNewQuestions, setNotifyOnNewQuestions] = useState(true);
  const [liturgicalMottoEnabled, setLiturgicalMottoEnabled] = useState(true);



  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validations
    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match. Please verify.");
      return;
    }

    try {
      setUpdatingPassword(true);

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setPasswordSuccess("Your password has been successfully updated!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 5000);
    } catch (err) {
      setPasswordError(err.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300/50">
            ቅንብሮች • Security & Preferences
          </span>
        </div>
        <h1 className="font-serif-eotc text-3xl font-bold text-slate-900 tracking-tight">
          Account Settings & Security
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your clergy credentials, update password, and configure platform preferences.
        </p>
      </div>

      {/* ── 1. Security & Change Password Section ── */}
      <div className="rounded-3xl border border-amber-900/15 bg-white p-7 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-eotc text-lg font-bold text-slate-900">
              Change Account Password (የይለፍ ቃል መቀየር)
            </h2>
            <p className="text-xs text-slate-500">
              Update your clergy authentication password to keep the spiritual portal secure.
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="rounded-2xl bg-rose-50 p-4 text-xs font-semibold text-rose-800 border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>New Password (አዲስ የይለፍ ቃል)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 6 characters..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Confirm New Password (የይለፍ ቃሉን ያረጋግጡ)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type your new password..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updatingPassword}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-900/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{updatingPassword ? "Updating Password..." : "Update Password • ይለፍ ቃል ቀይር"}</span>
          </button>
        </form>
      </div>

      {/* ── 2. Authenticated Profile Details Card ── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-eotc text-lg font-bold text-slate-900">
              Clergy Profile Information (የአካውንት መረጃ)
            </h2>
            <p className="text-xs text-slate-500">
              Details of the logged-in administrator or spiritual reviewer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Email Address
            </span>
            <p className="text-xs font-bold text-slate-900 truncate">
              {currentUser?.email || "admin@eotc-youth.org"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Role
            </span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">
                {role?.name || profile?.role || "Authorized Administrator"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Full Name
            </span>
            <p className="text-xs font-bold text-slate-900">
              {profile?.full_name || currentUser?.user_metadata?.full_name || "Clergy Administrator"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Account Status
            </span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800">Active & Authenticated</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Platform & Liturgical Preferences ── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-eotc text-lg font-bold text-slate-900">
              System Preferences (የስርዓት ምርጫዎች)
            </h2>
            <p className="text-xs text-slate-500">
              Customize portal features, alert sounds, and liturgical motto displays.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/20 border border-slate-100 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-700" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  New Youth Questions Notifications
                </span>
                <span className="text-[11px] text-slate-500">
                  Notify reviewer when youth submit new questions via the bot
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyOnNewQuestions}
              onChange={(e) => setNotifyOnNewQuestions(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/20 border border-slate-100 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Show EOTC Liturgical Motto in Header
                </span>
                <span className="text-[11px] text-slate-500">
                  Display "✞ በእምነትና በምግባር ማነጽ" banner on admin navigation
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={liturgicalMottoEnabled}
              onChange={(e) => setLiturgicalMottoEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
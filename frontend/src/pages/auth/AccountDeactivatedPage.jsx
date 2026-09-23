import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, LogIn, Mail, AlertTriangle, ArrowRight, User } from "lucide-react";
import { ROUTES } from "../../routes/routePaths";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import EthiopianCross from "../../components/ui/EthiopianCross";
import TibebRibbon from "../../components/ui/TibebRibbon";

export default function AccountDeactivatedPage() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleReturnToLogin() {
    try {
      setSigningOut(true);
      if (typeof logout === "function") {
        await logout();
      }
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setSigningOut(false);
      navigate(ROUTES.LOGIN, {
        replace: true,
      });
    }
  }

  const displayName = profile?.full_name || profile?.fullName || user?.user_metadata?.full_name || "";
  const displayEmail = user?.email || profile?.email || "";
  const displayRole = profile?.role || "Member";

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0f1d] text-slate-100 overflow-hidden px-4">
      {/* Top Ecclesiastical Tibeb Ribbon */}
      <TibebRibbon className="fixed top-0 left-0 h-2 w-full z-50 shadow-md" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rose-900/20 via-amber-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Cross Watermark */}
      <div className="absolute opacity-[0.03] pointer-events-none select-none">
        <EthiopianCross size={600} variant="white" />
      </div>

      <div className="relative w-full max-w-lg my-8 z-10">
        <div className="relative rounded-3xl bg-[#11192b]/95 border border-rose-500/30 p-8 shadow-2xl backdrop-blur-xl space-y-6 text-center">
          
          {/* Deactivation Icon Badge */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-inner">
            <ShieldX size={44} className="text-rose-500" />
          </div>

          {/* Status Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-950/60 border border-rose-800/60 px-3.5 py-1 text-xs font-semibold text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>መለያው ታግዷል • Account Deactivated</span>
          </div>

          {/* Headings */}
          <div className="space-y-1.5">
            <h1 className="font-serif-eotc text-2xl font-bold tracking-tight text-white">
              የእርስዎ መለያ ለጊዜው ታግዷል
            </h1>
            <p className="text-sm font-semibold text-rose-300/90">
              Your Account Has Been Deactivated
            </p>
          </div>

          {/* Detailed Message */}
          <div className="space-y-2 text-xs leading-relaxed text-slate-300 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <p className="font-serif-eotc text-amber-200/90 text-sm">
              የእርስዎ መለያ በስርዓት አስተዳዳሪው ለጊዜው ታግዷል። በአሁኑ ወቅት ወደ ኢ/ኦ/ተ/ቤ/ክ የወጣቶች ጥያቄና መልስ አገልግሎት ፖርታል መግባት አይችሉም።
            </p>
            <p className="text-slate-400 pt-1 border-t border-slate-800/80">
              Your account has been deactivated by the system administrator. You currently do not have access to the EOTC Youth Ministry portal.
            </p>
          </div>

          {/* Account Details if logged in */}
          {(displayName || displayEmail) && (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 text-left text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400 mb-1 font-medium">
                <User size={14} className="text-amber-400" />
                <span>Affected Account Details:</span>
              </div>
              {displayName && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-white">{displayName}</span>
                </div>
              )}
              {displayEmail && (
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-300">{displayEmail}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Role:</span>
                <span className="text-amber-400 font-semibold">{displayRole}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Status:</span>
                <span className="text-rose-400 font-bold">Inactive / Deactivated</span>
              </div>
            </div>
          )}

          {/* Contact Administrator Card */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-left space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
              <Mail size={16} />
              <span>Contact the System Administrator</span>
            </div>
            <p className="text-xs text-amber-200/80 leading-normal">
              If you believe this was done in error or require reactivation of your clergy/reviewer credentials, please contact your ministry supervisor or system administrator.
            </p>
          </div>

          {/* Return to Login Action Button */}
          <button
            type="button"
            disabled={signingOut}
            onClick={handleReturnToLogin}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-900/40 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 transition-all duration-200 cursor-pointer"
          >
            {signingOut ? (
              <span>ወደ መግቢያ ገጽ በመመለስ ላይ...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>ወደ መግቢያ ገጽ ተመለስ (Return to Login)</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </div>
      </div>
    </main>
  );
}
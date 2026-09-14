import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/routePaths";
import EthiopianCross from "../../components/ui/EthiopianCross";
import TibebRibbon from "../../components/ui/TibebRibbon";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(ROUTES.PROGRAMS, { replace: true });
      }
    });
  }, [navigate]);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (data?.session) {
        navigate(ROUTES.PROGRAMS, { replace: true });
      }
    } catch (err) {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0f1d] text-slate-100 overflow-hidden px-4">
      {/* Top Ecclesiastical Tibeb Ribbon */}
      <TibebRibbon className="fixed top-0 left-0 h-2 w-full z-50 shadow-md" />

      {/* Sacred Geometry Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-600/15 via-rose-900/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Large Cross Watermark in Background */}
      <div className="absolute opacity-[0.03] pointer-events-none select-none">
        <EthiopianCross size={600} variant="white" />
      </div>

      {/* Main Login Card */}
      <div className="relative w-full max-w-md my-8">
        <div className="relative rounded-3xl bg-[#11192b]/90 border border-amber-500/25 p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Header with Ethiopian Cross */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-700/15 to-transparent border border-amber-400/30 shadow-lg mb-1">
              <EthiopianCross size={52} variant="gold" />
            </div>

            <div className="space-y-1">
              <p className="text-[12px] font-serif-eotc text-amber-300 font-semibold tracking-wide">
                የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያን
              </p>
              <h1 className="font-serif-eotc text-2xl font-bold tracking-tight text-white">
                Youth Question Bot
              </h1>
              <p className="text-xs text-slate-400">
                Authorized Administrator & Reviewer Portal
              </p>
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 font-medium">
              ✞ በስመ አብ ወወልድ ወመንፈስ ቅዱስ አሐዱ አምላክ
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl bg-rose-950/50 border border-rose-800/60 p-3 text-xs text-rose-300 flex items-center gap-2">
              <span className="text-rose-400 font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Clergy / Admin Email</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="admin@eotc-youth.org"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-amber-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-amber-500 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-900/40 hover:from-amber-500 hover:to-amber-500 disabled:opacity-50 transition-all duration-200 mt-2 cursor-pointer"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Ministry Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Dedicated to the Orthodox youth spiritual growth</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
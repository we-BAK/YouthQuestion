import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ROUTES } from "../../routes/routePaths";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    navigate(ROUTES.ADMIN_USERS, { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl border bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Sign In</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage authorized users.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="block">
          <span className="label">Email</span>
          <input
            required
            type="email"
            className="input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="label">Password</span>
          <input
            required
            type="password"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button disabled={loading} className="button-primary w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
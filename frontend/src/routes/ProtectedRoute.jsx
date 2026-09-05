import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ROUTES } from "./routePaths";

export default function ProtectedRoute() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Loading...</div>;
  }

  return session ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
}
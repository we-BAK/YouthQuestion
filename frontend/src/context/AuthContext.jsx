import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { getUserRoleAndPermissions } from "../Services/rolePermissionService";

const AuthContext = createContext({
  user: null,
  profile: null,
  role: null,
  permissions: [],
  loading: true,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  refreshPermissions: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load RBAC info for a specific user ID
  const fetchRbac = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setRole(null);
      setPermissions([]);
      return;
    }

    try {
      const { profile: userProfile, role: userRole, permissions: userPerms } =
        await getUserRoleAndPermissions(userId);

      setProfile(userProfile);
      setRole(userRole);
      setPermissions(userPerms || []);
    } catch (err) {
      console.error("Failed to load user RBAC data:", err);
      setPermissions([]);
    }
  }, []);

  // Refresh permissions on demand
  const refreshPermissions = useCallback(async () => {
    if (user?.id) {
      await fetchRbac(user.id);
    }
  }, [user?.id, fetchRbac]);

  // Initial session check + Auth state listener
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          await fetchRbac(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setRole(null);
          setPermissions([]);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchRbac(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setPermissions([]);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchRbac]);

  // Realtime subscription: When permissions or roles change in the DB,
  // automatically refresh immediately so revoked permissions take effect live!
  useEffect(() => {
    if (!user?.id) return;

    console.log("🛡️ Subscribing to realtime RBAC updates...");

    const channel = supabase
      .channel("rbac-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "role_permissions",
        },
        (payload) => {
          console.log("🔔 Realtime role_permissions update detected:", payload);
          refreshPermissions();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("🔔 Realtime user_profile update detected:", payload);
          refreshPermissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refreshPermissions]);

  // Helper methods to verify permissions
  const hasPermission = useCallback(
    (permissionCode) => {
      if (!permissionCode) return true;
      return permissions.includes(permissionCode);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (codes = []) => {
      if (!codes || codes.length === 0) return true;
      return codes.some((code) => permissions.includes(code));
    },
    [permissions]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
    setPermissions([]);
  }, []);

  const value = {
    user,
    profile,
    role,
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    refreshPermissions,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

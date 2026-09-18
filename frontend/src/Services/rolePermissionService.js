import { supabase } from "../lib/supabase";

// ======================================================
// Get all active roles
// Used by Roles & Permissions page
// ======================================================
export async function getRoles() {
  console.log("🔵 Fetching roles...");

  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("is_active", true)
    .order("name");

  console.log("📦 Roles data:", data);
  console.log("❌ Roles error:", error);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}


// ======================================================
// Get all active permissions
// Used by Roles & Permissions page
// ======================================================
export async function getPermissions() {
  console.log("🔵 Fetching permissions...");

  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .eq("is_active", true)
    .order("name");

  console.log("📦 Permissions data:", data);
  console.log("❌ Permissions error:", error);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}


// ======================================================
// Get permissions assigned to a specific role
// Used by Roles & Permissions page
// ======================================================
export async function getRolePermissions(roleId) {
  console.log("🔵 Fetching role permissions for:", roleId);

  const { data, error } = await supabase
    .from("role_permissions")
    .select("role_id, permission_id")
    .eq("role_id", roleId);

  console.log("📦 Role permissions:", data);
  console.log("❌ Role permissions error:", error);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}


// ======================================================
// Save permissions for a role
// ======================================================
export async function saveRolePermissions(roleId, permissionIds) {
  console.log("💾 Saving permissions for role:", roleId);

  // Remove existing permissions
  const { error: deleteError } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // Nothing else to insert
  if (!permissionIds || permissionIds.length === 0) {
    return;
  }

  // Create new assignments
  const rows = permissionIds.map((permissionId) => ({
    role_id: roleId,
    permission_id: permissionId,
  }));

  const { error: insertError } = await supabase
    .from("role_permissions")
    .insert(rows);

  if (insertError) {
    throw new Error(insertError.message);
  }

  console.log("✅ Permissions saved successfully");
}


// ======================================================
// Get current user's role and permissions
//
// IMPORTANT:
// This function uses the database RPC instead of directly
// querying role_permissions + permissions from the browser.
//
// This avoids the RLS bootstrap problem.
// ======================================================
export async function getUserRoleAndPermissions(userId) {
  if (!userId) {
    return {
      profile: null,
      role: null,
      permissions: [],
    };
  }

  try {
    console.log("🔵 Loading RBAC for user:", userId);

    // --------------------------------------------------
    // 1. Get user's profile
    // --------------------------------------------------
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("👤 Profile:", profile);
    console.log("❌ Profile error:", profileError);

    if (profileError || !profile) {
      console.error(
        "❌ User profile could not be loaded:",
        profileError
      );

      return {
        profile: null,
        role: null,
        permissions: [],
      };
    }

    // --------------------------------------------------
    // 2. Get role information
    // --------------------------------------------------
    const {
      data: role,
      error: roleError,
    } = await supabase
      .from("roles")
      .select("*")
      .eq("code", profile.role)
      .eq("is_active", true)
      .maybeSingle();

    console.log("🎭 Role:", role);
    console.log("❌ Role error:", roleError);

    if (roleError || !role) {
      console.error(
        "❌ Role could not be loaded:",
        roleError
      );

      return {
        profile,
        role: null,
        permissions: [],
      };
    }

    // --------------------------------------------------
    // 3. Get current user's permissions through RPC
    // --------------------------------------------------
    console.log("🔐 Calling get_my_permissions RPC...");

    const {
      data: permissionData,
      error: permissionError,
    } = await supabase.rpc("get_my_permissions");

    console.log(
      "📦 RPC permission data:",
      permissionData
    );

    console.log(
      "❌ RPC permission error:",
      permissionError
    );

    if (permissionError) {
      console.error(
        "❌ Failed to load permissions:",
        permissionError
      );

      return {
        profile,
        role,
        permissions: [],
      };
    }

    // --------------------------------------------------
    // 4. Convert RPC result into permission code array
    // --------------------------------------------------
    const permissions = (permissionData || [])
      .map((item) => item.permission_code)
      .filter(Boolean);

    console.log(
      "✅ Final permissions:",
      permissions
    );

    console.log(
      `🔐 Loaded ${permissions.length} permissions`
    );

    return {
      profile,
      role,
      permissions,
    };

  } catch (error) {
    console.error(
      "❌ Failed in getUserRoleAndPermissions:",
      error
    );

    return {
      profile: null,
      role: null,
      permissions: [],
    };
  }
}
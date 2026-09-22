import { supabase } from "../lib/supabase";

// ======================================================
// Get all active roles
// ======================================================
export async function getRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// ======================================================
// Get all active permissions
// ======================================================
export async function getPermissions() {
  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// ======================================================
// Get permissions assigned to a specific role
// ======================================================
export async function getRolePermissions(roleId) {
  const { data, error } = await supabase
    .from("role_permissions")
    .select("role_id, permission_id")
    .eq("role_id", roleId);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// ======================================================
// Save permissions for a role
// ======================================================
export async function saveRolePermissions(
  roleId,
  permissionIds
) {
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
}

// ======================================================
// Get current user's role and permissions
//
// Uses the database RPC for permissions.
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

    if (profileError || !profile) {
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

    if (roleError || !role) {
      return {
        profile,
        role: null,
        permissions: [],
      };
    }

    // --------------------------------------------------
    // 3. Get permissions through RPC
    // --------------------------------------------------
    const {
      data: permissionData,
      error: permissionError,
    } = await supabase.rpc("get_my_permissions");

    if (permissionError) {
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

    return {
      profile,
      role,
      permissions,
    };
  } catch (error) {
    return {
      profile: null,
      role: null,
      permissions: [],
    };
  }
}
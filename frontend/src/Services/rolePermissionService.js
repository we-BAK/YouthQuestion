import { supabase } from "../lib/supabase";

export async function getRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getPermissions() {
  const { data, error } = await supabase
    .from("permissions")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getRolePermissions(roleId) {
  const { data, error } = await supabase
    .from("role_permissions")
    .select("role_id, permission_id")
    .eq("role_id", roleId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Save permissions for a role
export async function saveRolePermissions(roleId, permissionIds) {
  // Remove the role's current permissions
  const { error: deleteError } = await supabase
    .from("role_permissions")
    .delete()
    .eq("role_id", roleId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // If no permissions were selected, we're done
  if (permissionIds.length === 0) {
    return;
  }

  // Create the new role-permission records
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
const supabase = require("../config/supabase");

/**
 * Middleware to dynamically verify that the authenticated user has a specific permission.
 * Zero hardcoding: queries the user's role and permissions directly from the database.
 * If permission is revoked from a role in the DB, requests are immediately rejected (403).
 *
 * @param {string} permissionCode - The required permission code (e.g. 'QUESTIONS_VIEW')
 */
function requirePermission(permissionCode) {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || authHeader === "Bearer" || authHeader.includes("undefined") || authHeader.includes("null")) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      const token = authHeader.replace("Bearer ", "").trim();

      if (!token) {
        return res.status(401).json({
          error: "Authentication required",
        });
      }

      // 1. Verify JWT token with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.getUser(token);

      if (authError || !authData.user) {
        return res.status(401).json({
          error: "Invalid or expired session",
        });
      }

      // 2. Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, full_name, role, status")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        return res.status(403).json({
          error: "User profile not found",
        });
      }

      // 3. Verify user status is Active
      if (profile.status !== "Active") {
        return res.status(403).json({
          error: "Active account required. Your account is currently inactive.",
        });
      }

      // 4. Fetch the role from DB (by code or id)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profile.role);
      let roleQuery = supabase.from("roles").select("id, code, name, is_active");
      if (isUuid) {
        roleQuery = roleQuery.eq("id", profile.role);
      } else {
        roleQuery = roleQuery.eq("code", profile.role);
      }

      const { data: role, error: roleError } = await roleQuery.maybeSingle();

      if (roleError || !role || role.is_active === false) {
        return res.status(403).json({
          error: "Assigned role is invalid or inactive",
        });
      }

      // 5. Query role_permissions to verify granted permission
      const { data: rolePerms, error: permsError } = await supabase
        .from("role_permissions")
        .select("permission_id, permissions(id, code, is_active)")
        .eq("role_id", role.id);

      if (permsError) {
        return res.status(500).json({
          error: "Failed to verify role permissions",
        });
      }

      const userPermissions = (rolePerms || [])
        .filter((rp) => rp.permissions && rp.permissions.is_active !== false)
        .map((rp) => rp.permissions.code);

      if (!userPermissions.includes(permissionCode)) {
        return res.status(403).json({
          error: `Forbidden: You do not have the required permission (${permissionCode}) to perform this action.`,
          requiredPermission: permissionCode,
        });
      }

      // Attach authenticated user details
      req.user = authData.user;
      req.admin = authData.user;
      req.profile = profile;
      req.role = role;
      req.permissions = userPermissions;

      next();
    } catch (error) {
      console.error(`❌ requirePermission [${permissionCode}] error:`, error);
      return res.status(500).json({
        error: "Authentication and permission check failed",
      });
    }
  };
}

module.exports = requirePermission;

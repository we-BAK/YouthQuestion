const supabase = require("../config/supabase");

async function requireSuperAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // 1. Verify JWT token with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return res.status(401).json({
        error: "Invalid session",
      });
    }

    // 2. Fetch profile from user_profiles table using the actual database columns
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("id, role, status")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({
        error: "Profile not found",
      });
    }

    // 3. Verify user status is Active
    if (profile.status !== "Active") {
      return res.status(403).json({
        error: "Active profile required",
      });
    }

    // 4. Verify user role is Super Admin
    if (profile.role !== "Super Admin") {
      return res.status(403).json({
        error: "Super Admin privileges required",
      });
    }

    req.admin = authData.user;
    req.profile = profile;

    next();
  } catch (error) {
    console.error("❌ requireSuperAdmin error:", error);

    return res.status(500).json({
      error: "Authentication check failed",
    });
  }
}

module.exports = requireSuperAdmin;
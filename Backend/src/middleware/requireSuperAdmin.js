const supabase = require("../config/supabase");

async function requireSuperAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(
      "Bearer ",
      ""
    );

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return res.status(401).json({
        error: "Invalid session",
      });
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("id, is_active")
        .eq("id", authData.user.id)
        .single();

    if (
      profileError ||
      !profile ||
      !profile.is_active
    ) {
      return res.status(403).json({
        error: "Active profile required",
      });
    }

    req.admin = authData.user;

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Authentication check failed",
    });
  }
}

module.exports = requireSuperAdmin;
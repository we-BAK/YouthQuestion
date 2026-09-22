const {
  getAllUsers,
  getActiveUsers, 
  updateUserStatus:updateUserStatusService,
  createNewUser,
  createFirstSuperAdmin,
} = require("../services/userService");

// GET /api/users
async function getUsers(req, res) {
  try {
    const users = await getAllUsers();

    res.json(users);
  } catch (error) {
    console.error("❌ Failed to get users:", error);

    res.status(500).json({
      error: "Failed to retrieve users",
    });
  }
}

// GET /api/users/active
async function getActiveUsersList(req, res) {
  try {
    const activeUsers = await getActiveUsers();

    res.json(activeUsers);
  } catch (error) {
    console.error("❌ Failed to get active users:", error);

    res.status(500).json({
      error: "Failed to retrieve active users",
    });
  }
}

// POST /api/users
async function createUser(req, res) {
  try {
    const user = await createNewUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Failed to create user:", error);

    res.status(400).json({
      error: error.message,
    });
  }
}

// POST /api/users/bootstrap
async function bootstrapSuperAdmin(req, res) {
  try {
    const user = await createFirstSuperAdmin(
      req.body,
      req.headers["x-bootstrap-secret"]
    );

    res.status(201).json(user);
  } catch (error) {
    console.error("❌ Failed to bootstrap Super Admin:", error);

    res.status(400).json({
      error: error.message,
    });
  }
}

// ==========================================
// Update user status
// ==========================================
async function updateUserStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        error: "Status must be either Active or Inactive.",
      });
    }

    const updatedUser = await updateUserStatusService(
      id,
      status
    );

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
  getUsers,
  getActiveUsersList,
  createUser,
  bootstrapSuperAdmin,
  updateUserStatus,
};
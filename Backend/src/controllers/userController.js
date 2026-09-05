const {
  getAllUsers,
  getActiveUsers, // <-- Imported service function
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

module.exports = {
  getUsers,
  getActiveUsersList, // <-- Exported
  createUser,
  bootstrapSuperAdmin,
};
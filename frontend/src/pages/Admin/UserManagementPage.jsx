import { useEffect, useState } from "react";

import {
  createUser,
  getUsers,
  getActiveUsers,
  updateUserStatus,
} from "../../Services/userService";

import { getRoles } from "../../Services/rolePermissionService";

import UserPageHeader from "../../components/UserManagment/UserPageHeader";
import UserStats from "../../components/UserManagment/UserStats";
import UserTabs from "../../components/UserManagment/UserTabs";
import UserTable from "../../components/UserManagment/UserTable";
import RegisterUserModal from "../../components/UserManagment/RegisterUserModal";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [statusUpdating, setStatusUpdating] =
    useState(false);

  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showRegisterForm, setShowRegisterForm] =
    useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    status: "Active",
  });

  // ------------------------------------------
  // Load users
  // ------------------------------------------

  async function loadUsers(filterActive = false) {
    try {
      setLoading(true);
      setError("");

      const fetchFn = filterActive
        ? getActiveUsers
        : getUsers;

      const registeredUsers = await fetchFn();

      setUsers(registeredUsers || []);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load authorized users."
      );
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------
  // Load roles
  // ------------------------------------------

  async function loadRoles() {
    try {
      setRolesLoading(true);
      setError("");

      const roleData = await getRoles();

      const activeRoles = (
        roleData || []
      ).filter(
        (role) => role.is_active === true
      );

      setRoles(activeRoles);

      if (activeRoles.length > 0) {
        setForm((previousForm) => ({
          ...previousForm,
          role:
            previousForm.role ||
            activeRoles[0].code,
        }));
      }
    } catch (err) {
      setError(
        err.message || "Failed to load roles."
      );
    } finally {
      setRolesLoading(false);
    }
  }

  // ------------------------------------------
  // Initial load
  // ------------------------------------------

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    loadUsers(activeTab === "active");
  }, [activeTab]);

  // ------------------------------------------
  // Register modal
  // ------------------------------------------

  function handleOpenRegisterForm() {
    setError("");

    setForm({
      fullName: "",
      email: "",
      password: "",
      role:
        roles.length > 0
          ? roles[0].code
          : "",
      status: "Active",
    });

    setShowRegisterForm(true);
  }

  function handleCloseRegisterForm() {
    if (saving) return;

    setShowRegisterForm(false);
  }

  // ------------------------------------------
  // Create user
  // ------------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Email address is required."
      );
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    if (!form.role) {
      setError("Please select a role.");
      return;
    }

    try {
      setSaving(true);

      await createUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        status: form.status,
      });

      await loadUsers(
        activeTab === "active"
      );

      setShowRegisterForm(false);

      setForm({
        fullName: "",
        email: "",
        password: "",
        role:
          roles.length > 0
            ? roles[0].code
            : "",
        status: "Active",
      });
    } catch (err) {
      setError(
        err.message ||
          "Failed to create user."
      );
    } finally {
      setSaving(false);
    }
  }

  // ------------------------------------------
  // Activate / Deactivate user
  // ------------------------------------------

  async function handleStatusChange(user) {
    const isCurrentlyActive =
      user.status === "Active";

    const newStatus = isCurrentlyActive
      ? "Inactive"
      : "Active";

    const action = isCurrentlyActive
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setStatusUpdating(true);
      setError("");

      await updateUserStatus(
        user.id,
        newStatus
      );

      await loadUsers(
        activeTab === "active"
      );
    } catch (err) {
      setError(
        err.message ||
          `Failed to ${action} user.`
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  // ------------------------------------------
  // Statistics
  // ------------------------------------------

  const activeCount = users.filter(
    (user) => user.status === "Active"
  ).length;

  const reviewerCount = users.filter(
    (user) =>
      user.role === "REVIEWER" ||
      user.role === "Reviewer"
  ).length;

  return (
    <section className="space-y-6">

      <UserPageHeader
        onRegister={handleOpenRegisterForm}
      />

      <UserStats
        totalUsers={users.length}
        activeUsers={activeCount}
        reviewers={reviewerCount}
      />

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      <UserTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalUsers={users.length}
        activeUsers={activeCount}
      />

      <UserTable
        users={users}
        loading={loading}
        onStatusChange={handleStatusChange}
        statusUpdating={statusUpdating}
      />

      <RegisterUserModal
        open={showRegisterForm}
        onClose={handleCloseRegisterForm}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        roles={roles}
        rolesLoading={rolesLoading}
        saving={saving}
      />

    </section>
  );
}
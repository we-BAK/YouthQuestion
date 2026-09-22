import { useEffect, useState } from "react";

import {
  getRoles,
  getPermissions,
  getRolePermissions,
  saveRolePermissions,
} from "../../Services/rolePermissionService";

import {
  ShieldCheck,
  Check,
  Save,
  Loader2,
  Lock,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function RolesPermissionsPage() {
  const { hasPermission, refreshPermissions } = useAuth();

  const canManage = hasPermission("ROLES_MANAGE");

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // Load roles and permissions
  // ==========================================

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);
      setError("");

      const [rolesData, permissionsData] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);

      setRoles(rolesData || []);
      setPermissions(permissionsData || []);

      if (rolesData?.length > 0) {
        setSelectedRole(rolesData[0]);
      }
    } catch (err) {
      setError(
        err.message || "Failed to load roles and permissions."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // Load permissions for selected role
  // ==========================================

  useEffect(() => {
    if (!selectedRole) {
      setSelectedPermissions([]);
      return;
    }

    loadRolePermissions(selectedRole.id);
  }, [selectedRole]);

  async function loadRolePermissions(roleId) {
    try {
      setPermissionsLoading(true);
      setError("");
      setSuccess("");

      const data = await getRolePermissions(roleId);

      setSelectedPermissions(
        (data || []).map((item) => item.permission_id)
      );
    } catch (err) {
      setError(
        err.message || "Failed to load permissions for this role."
      );
    } finally {
      setPermissionsLoading(false);
    }
  }

  // ==========================================
  // Toggle permission
  // ==========================================

  function togglePermission(permissionId) {
    if (!canManage) return;

    setSelectedPermissions((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId);
      }

      return [...current, permissionId];
    });

    setSuccess("");
  }

  // ==========================================
  // Save permissions
  // ==========================================

  async function handleSave() {
    if (!selectedRole || !canManage) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await saveRolePermissions(
        selectedRole.id,
        selectedPermissions
      );

      // Refresh current active user's permissions from DB
      await refreshPermissions();

      setSuccess(
        `Permissions updated for ${selectedRole.name}. Changes applied across the system.`
      );
    } catch (err) {
      setError(
        err.message || "Failed to save permissions."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <section className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
            Access Control
          </span>
        </div>

        <h1 className="font-serif-eotc text-3xl font-bold text-slate-900">
          Roles & Permissions
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Define which areas and actions each ministry role can access.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          {success}
        </div>
      )}

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* ==========================================
            Roles
        ========================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="p-5 border-b border-slate-200">
            <h2 className="font-bold text-slate-900">
              Ministry Roles
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Select a role to configure.
            </p>
          </div>

          <div className="p-3 space-y-1">

            {roles.length === 0 ? (
              <div className="px-4 py-8 text-center">

                <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />

                <p className="text-sm font-medium text-slate-600">
                  No roles available
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  No active roles were found.
                </p>

              </div>
            ) : (
              roles.map((role) => {
                const active = selectedRole?.id === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition ${
                      active
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`p-2 rounded-lg ${
                          active
                            ? "bg-amber-200 text-amber-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-semibold truncate">
                          {role.name}
                        </p>

                        <p className="text-[11px] text-slate-500 truncate">
                          {role.code}
                        </p>

                      </div>

                    </div>

                  </button>
                );
              })
            )}

          </div>

        </div>

        {/* ==========================================
            Permissions
        ========================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-5 border-b border-slate-200 flex items-center justify-between">

            <div>

              <h2 className="font-bold text-slate-900">
                Permissions
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Configure access for{" "}
                <span className="font-semibold">
                  {selectedRole?.name || "No role selected"}
                </span>
              </p>

            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {selectedPermissions.length} selected
            </span>

          </div>

          <div className="p-5">

            {!selectedRole ? (

              <div className="py-16 text-center">

                <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-3" />

                <p className="text-sm font-medium text-slate-600">
                  Select a role
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Select a ministry role to configure its permissions.
                </p>

              </div>

            ) : permissionsLoading ? (

              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              </div>

            ) : permissions.length === 0 ? (

              <div className="py-16 text-center">

                <p className="text-sm font-medium text-slate-600">
                  No permissions available
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  No active permissions were found.
                </p>

              </div>

            ) : (

              <>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {permissions.map((permission) => {

                    const checked =
                      selectedPermissions.includes(permission.id);

                    return (
                      <label
                        key={permission.id}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                          checked
                            ? "border-amber-300 bg-amber-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            togglePermission(permission.id)
                          }
                          className="sr-only"
                        />

                        <div
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            checked
                              ? "bg-amber-600 border-amber-600 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {checked && (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-semibold text-slate-800">
                            {permission.name}
                          </p>

                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {permission.code}
                          </p>

                          {permission.description && (
                            <p className="text-xs text-slate-500 mt-1">
                              {permission.description}
                            </p>
                          )}

                        </div>

                      </label>
                    );
                  })}

                </div>

                {/* Save Button / Read Only notice */}

                <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-200">

                  {!canManage ? (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">

                      <Lock className="w-3.5 h-3.5" />

                      <span>
                        Viewing mode: ROLES_MANAGE permission required to edit roles
                      </span>

                    </div>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      saving ||
                      !selectedRole ||
                      !canManage
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold disabled:opacity-50 transition cursor-pointer"
                  >

                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Permissions
                      </>
                    )}

                  </button>

                </div>

              </>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}
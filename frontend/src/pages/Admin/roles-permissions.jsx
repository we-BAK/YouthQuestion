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
} from "lucide-react";

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================================
  // Load roles and permissions
  // ================================

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
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // Load permissions for selected role
  // ================================

  useEffect(() => {
    if (!selectedRole) return;

    loadRolePermissions(selectedRole.id);
  }, [selectedRole]);

  async function loadRolePermissions(roleId) {
    try {
      setError("");
      setSuccess("");

      const data = await getRolePermissions(roleId);

      setSelectedPermissions(
        (data || []).map((item) => item.permission_id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  // ================================
  // Toggle permission
  // ================================

  function togglePermission(permissionId) {
    setSelectedPermissions((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId);
      }

      return [...current, permissionId];
    });
  }

  // ================================
  // Save
  // ================================

  async function handleSave() {
    if (!selectedRole) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await saveRolePermissions(
        selectedRole.id,
        selectedPermissions
      );

      setSuccess(
        `Permissions updated for ${selectedRole.name}.`
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ================================
  // Loading
  // ================================

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
      </div>
    );
  }

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

        {/* Roles */}
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

            {roles.map((role) => {
              const active = selectedRole?.id === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition ${
                    active
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : "hover:bg-slate-50 text-slate-700"
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

                    <div>
                      <p className="text-sm font-semibold">
                        {role.name}
                      </p>

                      <p className="text-[11px] text-slate-500">
                        {role.code}
                      </p>
                    </div>

                  </div>
                </button>
              );
            })}

          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-5 border-b border-slate-200 flex items-center justify-between">

            <div>
              <h2 className="font-bold text-slate-900">
                Permissions
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Configure access for{" "}
                <span className="font-semibold">
                  {selectedRole?.name}
                </span>
              </p>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {selectedPermissions.length} selected
            </span>

          </div>

          <div className="p-5">

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
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
                        checked
                          ? "bg-amber-600 border-amber-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {checked && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div>
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

            {/* Save */}
            <div className="flex justify-end mt-6 pt-5 border-t border-slate-200">

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !selectedRole}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold disabled:opacity-50 transition"
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

          </div>
        </div>

      </div>
    </section>
  );
}
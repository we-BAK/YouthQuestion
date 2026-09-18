import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Admin/DashboardPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import QuestionsPage from "../pages/Admin/QuestionsPage";
import SettingsPage from "../pages/Admin/SettingsPage";
import CategoriesPage from "../pages/Admin/CategoriesPage";
import AuditLogsPage from "../pages/Admin/AuditLogs";
import ProgramsListPage from "../pages/Admin/ProgramsListPage";
import CreateProgramPage from "../pages/Admin/CreateProgramPage";
import ProgramDetailsPage from "../pages/Admin/ProgramDetailsPage";
import RolesPermissionsPage from "../pages/Admin/roles-permissions";
import AccessDenied from "../pages/Admin/AccessDenied";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";
import { ROUTES } from "./routePaths";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard is open to all authenticated ministry staff */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* User Management */}
          <Route
            path="users"
            element={
              <PermissionRoute permission="USERS_VIEW">
                <UserManagementPage />
              </PermissionRoute>
            }
          />

          {/* Questions Review */}
          <Route
            path="questions"
            element={
              <PermissionRoute permission="QUESTIONS_VIEW">
                <QuestionsPage />
              </PermissionRoute>
            }
          />

          {/* Programs Routes */}
          <Route
            path="programs"
            element={
              <PermissionRoute permission="PROGRAMS_VIEW">
                <ProgramsListPage />
              </PermissionRoute>
            }
          />
          <Route
            path="programs/new"
            element={
              <PermissionRoute permission="PROGRAMS_CREATE">
                <CreateProgramPage />
              </PermissionRoute>
            }
          />
          <Route
            path="programs/:id"
            element={
              <PermissionRoute permission="PROGRAMS_VIEW">
                <ProgramDetailsPage />
              </PermissionRoute>
            }
          />

          {/* Categories */}
          <Route
            path="categories"
            element={
              <PermissionRoute permission="CATEGORIES_VIEW">
                <CategoriesPage />
              </PermissionRoute>
            }
          />

          {/* Roles & Permissions */}
          <Route
            path="roles-permissions"
            element={
              <PermissionRoute permission="ROLES_VIEW">
                <RolesPermissionsPage />
              </PermissionRoute>
            }
          />

          {/* Audit Logs */}
          <Route
            path="audit-logs"
            element={
              <PermissionRoute permission="AUDIT_LOGS_VIEW">
                <AuditLogsPage />
              </PermissionRoute>
            }
          />

          {/* Settings */}
          <Route
            path="settings"
            element={
              <PermissionRoute permission="SETTINGS_VIEW">
                <SettingsPage />
              </PermissionRoute>
            }
          />

          {/* Explicit Access Denied Page */}
          <Route path="access-denied" element={<AccessDenied />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
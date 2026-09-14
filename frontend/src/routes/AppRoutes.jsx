import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Admin/DashboardPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import QuestionsPage from "../pages/Admin/QuestionsPage";
import SettingsPage from "../pages/Admin/SettingsPage";
import AuditLogsPage from "../pages/Admin/AuditLogs";
import ProgramsListPage from "../pages/Admin/ProgramsListPage";
import CreateProgramPage from "../pages/Admin/CreateProgramPage";
import ProgramDetailsPage from "../pages/Admin/ProgramDetailsPage";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routePaths";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          
          {/* Programs Routes */}
          <Route path="programs" element={<ProgramsListPage />} />
          <Route path="programs/new" element={<CreateProgramPage />} />
          <Route path="programs/:id" element={<ProgramDetailsPage />} />

          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import LoginPage from "../pages/Login/LoginPage";
import UserManagementPage from "../pages/Admin/UserManagementPage";
import QuestionsPage from "../pages/Admin/QuestionsPage";
import SettingsPage from "../pages/Admin/SettingsPage"; // 1. Import SettingsPage
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./routePaths";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="settings" element={<SettingsPage />} /> {/* 2. Add route */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
    </Routes>
  );
}
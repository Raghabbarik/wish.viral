import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import TemplatesPage from "./pages/TemplatesPage";
import CelebrationsPage from "./pages/CelebrationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import { AdminGuard } from "./utils/authGuard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="celebrations" element={<CelebrationsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

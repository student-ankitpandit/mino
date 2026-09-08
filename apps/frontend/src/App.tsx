import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateOrgPage } from "./pages/CreateOrgPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BoardPage } from "./pages/BoardPage";
import { ChangelogPage } from "./pages/ChangelogPage";
import { PrivacyTermsPage } from "./pages/PrivacyTermsPage";

import { ShowcaseBoard, ShowcaseDashboard, ShowcaseOrg, ShowcaseSettings } from "./pages/ShowcasePreview";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/create-org" element={<CreateOrgPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/privacy-terms" element={<PrivacyTermsPage />} />
          <Route path="/privacy" element={<PrivacyTermsPage />} />
          <Route path="/terms" element={<PrivacyTermsPage />} />
          <Route path="/showcase/board" element={<ShowcaseBoard />} />
          <Route path="/showcase/dashboard" element={<ShowcaseDashboard />} />
          <Route path="/showcase/org" element={<ShowcaseOrg />} />
          <Route path="/showcase/settings" element={<ShowcaseSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
